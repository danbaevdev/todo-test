export interface Todo {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  title: string
  todos: Todo[]
  createdAt: number
  updatedAt: number
}

/** Bumped whenever the persisted shape changes; drives migrations. */
export const SCHEMA_VERSION = 1

export interface PersistedState {
  schemaVersion: number
  notes: Note[]
}

export interface PersistedDraft {
  schemaVersion: number
  noteId: string
  /** The in-progress note snapshot. */
  note: Note
  savedAt: number
}
