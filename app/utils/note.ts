import type { Todo } from '~/types/note'

export interface NoteContent {
  title: string
  todos: Todo[]
}

/**
 * Normalize a note before it is persisted: trim the title and every todo's text.
 * Empty todos are kept — they just render muted ("Без текста").
 */
export function sanitizeNoteContent(input: NoteContent): NoteContent {
  return {
    title: input.title.trim(),
    todos: input.todos.map((t) => ({ ...t, text: t.text.trim() })),
  }
}

export interface TodoPreview {
  visible: Todo[]
  hiddenCount: number
}

/**
 * Which todos to show in a note-card preview.
 * If cutting at `max` would hide just one item, that item is shown instead —
 * a "+1 more" line is pointless when it costs the same room as the item.
 */
export function previewTodos(todos: Todo[], max: number): TodoPreview {
  const overflow = Math.max(0, todos.length - max)
  const count = overflow <= 1 ? todos.length : max
  return { visible: todos.slice(0, count), hiddenCount: todos.length - count }
}
