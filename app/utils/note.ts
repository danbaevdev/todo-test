import type { Note, Todo } from '~/types/note'

export interface NoteContent {
  title: string
  todos: Todo[]
}

export interface DisplayTitle {
  text: string
  /** true when `text` is not the note's own title (derived / placeholder). */
  isFallback: boolean
  /** id of the todo borrowed as the title, so a preview can skip it. */
  fromTodoId: string | null
}

/**
 * What to show as a note's title:
 *   1. its own title, if any
 *   2. otherwise the first non-empty todo's text (like Apple Notes)
 *   3. otherwise a muted placeholder (such a note isn't kept once you leave it)
 */
export function noteTitle(note: Pick<Note, 'title' | 'todos'>): DisplayTitle {
  const trimmed = note.title.trim()
  if (trimmed) return { text: trimmed, isFallback: false, fromTodoId: null }

  const firstFilled = note.todos.find((t) => t.text.trim() !== '')
  if (firstFilled) {
    return { text: firstFilled.text.trim(), isFallback: true, fromTodoId: firstFilled.id }
  }

  return { text: 'Без названия', isFallback: true, fromTodoId: null }
}

/** A note with neither a title nor any todo text — nothing worth persisting. */
export function isNoteEmpty(note: Pick<Note, 'title' | 'todos'>): boolean {
  return !note.title.trim() && !note.todos.some((t) => t.text.trim() !== '')
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
