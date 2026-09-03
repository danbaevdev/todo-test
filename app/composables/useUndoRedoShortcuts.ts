import {onBeforeUnmount, onMounted} from 'vue'

interface Options {
  undo: () => void
  redo: () => void
  /** Whether shortcuts are currently active (e.g. no modal open). */
  enabled: () => boolean
}

function isTextEntry(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

/**
 * Global Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z for the edit page.
 *
 * Conflict rule: while a text field is focused the browser's native
 * per-character undo stays in charge — we only take over when focus is
 * elsewhere (toolbar, checkboxes, page body). Field edits reach our history
 * anyway via blur/pause sealing, so nothing is lost.
 */
export function useUndoRedoShortcuts(options: Options) {
  function onKeydown(event: KeyboardEvent) {
    const isZ = event.key.toLowerCase() === 'z'
    if (!isZ || !(event.ctrlKey || event.metaKey) || event.altKey) return
    if (!options.enabled()) return
    if (isTextEntry(event.target)) return

    event.preventDefault()
    if (event.shiftKey) options.redo()
    else options.undo()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
