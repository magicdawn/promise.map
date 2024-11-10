export class Limiter {
  constructor(public concurrency: number) {}

  running = 0

  queue: Array<() => void> = []

  async run<T>(task: () => T) {
    const p = new Promise<Awaited<T>>((resolve) => {
      this.queue.push(async () => {
        const taskp = Promise.resolve(task())
        resolve(taskp)

        // wait complete
        try {
          await taskp
        } catch {
          //
        }

        this.running--
        this.replenish()
      })
    })

    this.replenish()

    return p
  }

  replenish() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      this.running++
      this.queue.shift()!()
    }
  }
}

const limit = new Limiter(2)

async function test(num: number) {
  console.log(`${num} start`)
  await new Promise((r) => setTimeout(r, num * 1000))
  console.log(`${num} end`)
}

Promise.all([
  //
  limit.run(() => test(1)),
  limit.run(() => test(2)),
  limit.run(() => test(3)),
  limit.run(() => test(4)),
  limit.run(() => test(5)),
])
