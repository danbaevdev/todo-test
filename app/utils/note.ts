import type { Todo } from '~/types/note'

export interface NoteContent {
  title: string
  todos: Todo[]
}

/**
 * Normalize a note before it is persisted: trim the title and every todo,
 * and drop todos that end up with no text (empty pieces are just noise).
 */
export function sanitizeNoteContent(input: NoteContent): NoteContent {
  return {
    title: input.title.trim(),
    todos: input.todos
      .map((t) => ({ ...t, text: t.text.trim() }))
      .filter((t) => t.text !== ''),
  }
}
