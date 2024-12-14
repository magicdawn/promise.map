export class Dispatcher<E> {
  private executors: E[]
  private idleArray: boolean[]
  constructor(executors: E[]) {
    this.executors = executors
    this.idleArray = new Array(executors.length).fill(true)
  }

  private aborted = false
  abort() {
    this.aborted = true
    this.pendingResolves = [] // clear references
  }

  pendingResolves: Array<() => void> = []
  replenish = ({ executor, index }: { executor: E; index: number }) => {
    if (this.aborted) return
    if (!this.pendingResolves.length) return
    this.pendingResolves.shift()?.()
  }

  private async getExecutor() {
    const findIndex = () => this.executors.findIndex((x, index) => this.idleArray[index])

    let index = findIndex()
    while (index === -1) {
      const { promise, resolve } = Promise.withResolvers<void>()
      this.pendingResolves.push(resolve)
      await promise
      index = findIndex()
    }

    // mark used
    const executor = this.executors[index]
    this.idleArray[index] = false
    return { executor, index }
  }

  async dispatch<T>(action: (executor: E) => T) {
    const { executor, index } = await this.getExecutor()
    try {
      return await action(executor)
    } finally {
      this.idleArray[index] = true
      // replenish run as a `macro task`, before this macro task, `abort` can be called
      setTimeout(() => this.replenish({ executor, index }))
    }
  }
}
