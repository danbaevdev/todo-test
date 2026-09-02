import { onBeforeUnmount, onMounted, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Traps Tab focus inside `container` while mounted, moves focus in on mount and
 * restores it to the previously focused element on unmount.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>) {
  let previouslyFocused: HTMLElement | null = null

  function focusable(): HTMLElement[] {
    if (!container.value) return []
    return Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !container.value) return
    const items = focusable()
    if (items.length === 0) {
      event.preventDefault()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey && (active === first || !container.value.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  onMounted(() => {
    previouslyFocused = document.activeElement as HTMLElement | null
    const items = focusable()
    ;(items[0] ?? container.value)?.focus()
    document.addEventListener('keydown', onKeydown, true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown, true)
    previouslyFocused?.focus?.()
  })
}
