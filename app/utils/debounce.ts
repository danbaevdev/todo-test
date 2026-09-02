export interface Debounced<A extends unknown[]> {
  (...args: A): void
  /** Run the pending call immediately, if any. */
  flush(): void
  /** Drop the pending call without running it. */
  cancel(): void
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: A | null = null

  const run = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (lastArgs) {
      const args = lastArgs
      lastArgs = null
      fn(...args)
    }
  }

  const debounced = ((...args: A) => {
    lastArgs = args
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, wait)
  }) as Debounced<A>

  debounced.flush = run
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastArgs = null
  }

  return debounced
}
