import {
  SCHEMA_VERSION,
  type Note,
  type PersistedDraft,
  type PersistedState,
} from '~/types/note'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const NOTES_KEY = 'notes-todo:state'
export const DRAFT_KEY_PREFIX = 'notes-todo:draft:'

const noopStorage: StorageLike = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

function resolveBackend(explicit?: StorageLike): StorageLike {
  if (explicit) return explicit
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage
  return noopStorage
}

/**
 * Bring an unknown persisted blob up to the current schema version.
 * Unknown / newer / corrupt data falls back to an empty state.
 */
export function migrateState(raw: unknown): PersistedState {
  const empty: PersistedState = { schemaVersion: SCHEMA_VERSION, notes: [] }
  if (!raw || typeof raw !== 'object') return empty

  const candidate = raw as Partial<PersistedState>
  if (!Array.isArray(candidate.notes)) return empty

  // Only v1 exists today; future versions add `case` branches here.
  const version = typeof candidate.schemaVersion === 'number' ? candidate.schemaVersion : 0
  if (version > SCHEMA_VERSION) return empty

  const notes = candidate.notes.filter(isValidNote)
  return { schemaVersion: SCHEMA_VERSION, notes }
}

function isValidNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const n = value as Partial<Note>
  return (
    typeof n.id === 'string' &&
    typeof n.title === 'string' &&
    Array.isArray(n.todos) &&
    n.todos.every(
      (t) =>
        t &&
        typeof t === 'object' &&
        typeof (t as { id?: unknown }).id === 'string' &&
        typeof (t as { text?: unknown }).text === 'string' &&
        typeof (t as { done?: unknown }).done === 'boolean',
    )
  )
}

export interface NotesStorage {
  readNotes(): Note[]
  writeNotes(notes: Note[]): void
  readDraft(noteId: string): PersistedDraft | null
  writeDraft(draft: PersistedDraft): void
  clearDraft(noteId: string): void
}

export function createNotesStorage(backend?: StorageLike): NotesStorage {
  const store = resolveBackend(backend)

  return {
    readNotes() {
      const rawText = store.getItem(NOTES_KEY)
      if (!rawText) return []
      try {
        return migrateState(JSON.parse(rawText)).notes
      } catch {
        return []
      }
    },

    writeNotes(notes) {
      const payload: PersistedState = { schemaVersion: SCHEMA_VERSION, notes }
      store.setItem(NOTES_KEY, JSON.stringify(payload))
    },

    readDraft(noteId) {
      const rawText = store.getItem(DRAFT_KEY_PREFIX + noteId)
      if (!rawText) return null
      try {
        const parsed = JSON.parse(rawText) as Partial<PersistedDraft>
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.schemaVersion === SCHEMA_VERSION &&
          parsed.note &&
          isValidNote(parsed.note) &&
          typeof parsed.noteId === 'string'
        ) {
          return parsed as PersistedDraft
        }
        return null
      } catch {
        return null
      }
    },

    writeDraft(draft) {
      store.setItem(DRAFT_KEY_PREFIX + draft.noteId, JSON.stringify(draft))
    },

    clearDraft(noteId) {
      store.removeItem(DRAFT_KEY_PREFIX + noteId)
    },
  }
}
