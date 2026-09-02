import type { StorageLike } from '~/utils/storage'
import type { Note } from '~/types/note'

export function memoryStorage(seed: Record<string, string> = {}): StorageLike & { dump: Map<string, string> } {
  const dump = new Map<string, string>(Object.entries(seed))
  return {
    dump,
    getItem: (k) => (dump.has(k) ? dump.get(k)! : null),
    setItem: (k, v) => void dump.set(k, v),
    removeItem: (k) => void dump.delete(k),
  }
}

export function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 'note-1',
    title: 'Note',
    todos: [],
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}
