import type { Note, Todo } from '~/types/note'

export interface NoteContent {
  title: string
  todos: Todo[]
}

/**
 * What to show as a note's title:
 *   1. its own title, if any
 *   2. otherwise the first non-empty todo's text (like Apple Notes) — that todo
 *      still stays in the list below
 *   3. otherwise a placeholder (such a note isn't kept once you leave it)
 */
export function noteTitle(note: Pick<Note, 'title' | 'todos'>): string {
  const trimmed = note.title.trim()
  if (trimmed) return trimmed

  const firstFilled = note.todos.find((t) => t.text.trim() !== '')
  return firstFilled ? firstFilled.text.trim() : 'Без названия'
}

/** A note with neither a title nor any todo text — nothing worth persisting. */
export function isNoteEmpty(note: Pick<Note, 'title' | 'todos'>): boolean {
  return !note.title.trim() && !note.todos.some((t) => t.text.trim() !== '')
}

/**
 * Normalize a note for persistence: trim the title and every todo, then drop
 * todos that are still empty. Empty rows are fine while editing (you're about
 * to fill them) but there's no reason to save them.
 */
export function sanitizeNoteContent(input: NoteContent): NoteContent {
  return {
    title: input.title.trim(),
    todos: input.todos
      .map((t) => ({ ...t, text: t.text.trim() }))
      .filter((t) => t.text !== ''),
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
