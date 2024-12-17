type Ref<T> = { val: T }

export class Dispatcher<E> {
  static fromConcurrency(concurrency: number, label = '') {
    if (!isFinite(concurrency)) throw new Error('concurrency must be finite')
    if (!(concurrency > 0)) throw new Error('concurrency must be greater than 0')
    const executors = new Array(concurrency).fill(0).map((_, index) =>
      [label, `executors(${concurrency})`, index]
        .map((x) => x && x.toString().trim())
        .filter(Boolean)
        .join('.'),
    )
    return new Dispatcher(executors)
  }

  private unwrapRef<T>(ref: Ref<T>): T {
    return ref.val
  }

  private executorRefs: Ref<E>[]
  private idleState: WeakMap<Ref<E>, boolean>
  constructor(executors: E[]) {
    if (!executors.length) throw new Error('executors can not be empty')
    this.executorRefs = executors.map((x) => ({ val: x })) // weakmap 需要 reference type 作为 key
    this.idleState = new WeakMap()
    this.executorRefs.forEach((x) => this.idleState.set(x, true))
  }

  private aborted = false
  abort() {
    this.aborted = true
    this.pendingResolves = [] // clear references
  }

  pendingResolves: Array<() => void> = []
  replenish = (executor: Ref<E>) => {
    if (this.aborted) return
    if (!this.pendingResolves.length) return
    this.pendingResolves.shift()?.()
  }

  private async getExecutorRef() {
    const find = () => this.executorRefs.find((x) => this.idleState.get(x))

    let executorRef = find()
    while (!executorRef) {
      const { promise, resolve } = Promise.withResolvers<void>()
      this.pendingResolves.push(resolve)
      await promise
      executorRef = find()
    }

    this.idleState.set(executorRef, false) // mark used
    return executorRef
  }

  async dispatch<R>(action: (executor: E) => R): Promise<Awaited<R>> {
    const executorRef = await this.getExecutorRef()
    const executor = this.unwrapRef(executorRef)
    try {
      return await action(executor)
    } finally {
      this.idleState.set(executorRef, true)
      // replenish run as a `macro task`, before this macro task, `abort` can be called
      setTimeout(() => this.replenish(executorRef))
    }
  }
}
