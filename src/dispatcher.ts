export type UniversalMap<E, V> = E extends object ? WeakMap<E, V> : Map<E, V>

export class Dispatcher<E> {
  private executors: E[]
  private idleMap: UniversalMap<E, boolean>
  constructor(executors: E[]) {
    if (!executors.length) throw new Error('executors can not be empty')
    this.executors = executors

    this.idleMap = (
      executors[0] && typeof executors[0] === 'object'
        ? new WeakMap<E & object, boolean>()
        : new Map<E, boolean>()
    ) as UniversalMap<E, boolean>
    executors.forEach((x) => this.idleMap.set(x, true))
  }

  private aborted = false
  abort() {
    this.aborted = true
    this.pendingResolves = [] // clear references
  }

  pendingResolves: Array<() => void> = []
  replenish = (executor: E) => {
    if (this.aborted) return
    if (!this.pendingResolves.length) return
    this.pendingResolves.shift()?.()
  }

  private async getExecutor() {
    const find = () => this.executors.find((x) => this.idleMap.get(x))

    let executor = find()
    while (!executor) {
      const { promise, resolve } = Promise.withResolvers<void>()
      this.pendingResolves.push(resolve)
      await promise
      executor = find()
    }

    this.idleMap.set(executor, false) // mark used
    return executor
  }

  async dispatch<T>(action: (executor: E) => T) {
    const executor = await this.getExecutor()
    try {
      return await action(executor)
    } finally {
      this.idleMap.set(executor, true)
      // replenish run as a `macro task`, before this macro task, `abort` can be called
      setTimeout(() => this.replenish(executor))
    }
  }
}
