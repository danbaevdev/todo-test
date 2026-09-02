import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '~/stores/notes'
import { createNotesStorage } from '~/utils/storage'
import { memoryStorage } from './helpers'

describe('notes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  function setup() {
    const backend = memoryStorage()
    const store = useNotesStore()
    store._useStorage(createNotesStorage(backend))
    store.init()
    return { store, backend }
  }

  it('loads notes from storage on init', () => {
    const backend = memoryStorage()
    createNotesStorage(backend).writeNotes([
      { id: 'a', title: 'A', todos: [], createdAt: 1, updatedAt: 1 },
    ])
    const store = useNotesStore()
    store._useStorage(createNotesStorage(backend))
    store.init()
    expect(store.notes.map((n) => n.id)).toEqual(['a'])
  })

  it('creates, updates and deletes notes', () => {
    const { store } = setup()
    const note = store.createNote({ title: 'First' })
    expect(store.getNote(note.id)?.title).toBe('First')

    store.updateNote(note.id, { title: 'Renamed', todos: [{ id: 't', text: 'x', done: false }] })
    expect(store.getNote(note.id)?.title).toBe('Renamed')
    expect(store.getNote(note.id)?.todos).toHaveLength(1)

    store.deleteNote(note.id)
    expect(store.hasNote(note.id)).toBe(false)
  })

  it('updateNote is a no-op when the note is gone (deleted in another tab)', () => {
    const { store } = setup()
    const ok = store.updateNote('ghost', { title: 'x', todos: [] })
    expect(ok).toBe(false)
  })

  it('debounces persistence rather than writing on every change', () => {
    const { store, backend } = setup()
    const spy = vi.spyOn(backend, 'setItem')

    store.createNote({ title: 'a' })
    store.createNote({ title: 'b' })
    store.createNote({ title: 'c' })
    expect(spy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(600)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('flush writes immediately', () => {
    const { store, backend } = setup()
    const spy = vi.spyOn(backend, 'setItem')
    store.createNote({ title: 'a' })
    store.flush()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('sortedNotes orders by updatedAt desc', () => {
    const { store } = setup()
    const a = store.createNote({ title: 'a' })
    const b = store.createNote({ title: 'b' })
    store.getNote(a.id)!.updatedAt = 5000
    store.getNote(b.id)!.updatedAt = 1000
    expect(store.sortedNotes.map((n) => n.id)).toEqual([a.id, b.id])
  })
})
