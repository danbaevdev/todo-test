import { describe, expect, it } from 'vitest'
import {
  createNotesStorage,
  DRAFT_KEY_PREFIX,
  migrateState,
  NOTES_KEY,
} from '~/utils/storage'
import { SCHEMA_VERSION } from '~/types/note'
import { makeNote, memoryStorage } from './helpers'

describe('migrateState', () => {
  it('returns empty state for garbage / missing input', () => {
    expect(migrateState(null).notes).toEqual([])
    expect(migrateState('nope' as unknown).notes).toEqual([])
    expect(migrateState({ notes: 'x' }).notes).toEqual([])
  })

  it('rejects a newer schema version', () => {
    const state = migrateState({ schemaVersion: SCHEMA_VERSION + 1, notes: [makeNote()] })
    expect(state.notes).toEqual([])
  })

  it('keeps only structurally valid notes', () => {
    const state = migrateState({
      schemaVersion: SCHEMA_VERSION,
      notes: [makeNote({ id: 'ok' }), { id: 5, title: 'bad' }, { id: 'x' }],
    })
    expect(state.notes.map((n) => n.id)).toEqual(['ok'])
  })
})

describe('createNotesStorage', () => {
  it('round-trips notes with a schema version', () => {
    const backend = memoryStorage()
    const storage = createNotesStorage(backend)
    const notes = [makeNote({ id: 'a', todos: [{ id: 't', text: 'x', done: true }] })]

    storage.writeNotes(notes)
    expect(JSON.parse(backend.dump.get(NOTES_KEY)!).schemaVersion).toBe(SCHEMA_VERSION)
    expect(storage.readNotes()).toEqual(notes)
  })

  it('recovers from corrupt JSON', () => {
    const backend = memoryStorage({ [NOTES_KEY]: '{ not json' })
    expect(createNotesStorage(backend).readNotes()).toEqual([])
  })

  it('stores, reads and clears a draft', () => {
    const backend = memoryStorage()
    const storage = createNotesStorage(backend)
    const draft = {
      schemaVersion: SCHEMA_VERSION,
      noteId: 'n1',
      note: makeNote({ id: 'n1', title: 'wip' }),
      savedAt: 123,
    }

    storage.writeDraft(draft)
    expect(backend.dump.has(DRAFT_KEY_PREFIX + 'n1')).toBe(true)
    expect(storage.readDraft('n1')).toEqual(draft)

    storage.clearDraft('n1')
    expect(storage.readDraft('n1')).toBeNull()
  })

  it('ignores a draft with a mismatched schema version', () => {
    const backend = memoryStorage({
      [DRAFT_KEY_PREFIX + 'n1']: JSON.stringify({
        schemaVersion: 999,
        noteId: 'n1',
        note: makeNote(),
        savedAt: 1,
      }),
    })
    expect(createNotesStorage(backend).readDraft('n1')).toBeNull()
  })
})
