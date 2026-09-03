import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {createId} from '~/utils/id'
import {debounce} from '~/utils/debounce'
import {createNotesStorage, NOTES_KEY, type NotesStorage} from '~/utils/storage'
import type {Note, Todo} from '~/types/note'

const PERSIST_DELAY = 500

export interface NewNoteInput {
  title: string
  todos: Todo[]
}

export const useNotesStore = defineStore('notes', () => {
  let storage: NotesStorage = createNotesStorage()
  const notes = ref<Note[]>([])
  const loaded = ref(false)
  let listenersBound = false

  const persist = debounce(() => {
    storage.writeNotes(notes.value)
  }, PERSIST_DELAY)

  function schedulePersist() {
    persist()
  }

  const sortedNotes = computed(() => [...notes.value].sort((a, b) => b.updatedAt - a.updatedAt))

  function getNote(id: string): Note | undefined {
    return notes.value.find(n => n.id === id)
  }

  function hasNote(id: string): boolean {
    return notes.value.some(n => n.id === id)
  }

  function reloadFromStorage() {
    notes.value = storage.readNotes()
  }

  function onExternalStorage(event: StorageEvent) {
    if (event.key === NOTES_KEY || event.key === null) {
      reloadFromStorage()
    }
  }

  function onWindowHidden() {
    if (document.visibilityState === 'hidden') persist.flush()
  }

  function init() {
    if (loaded.value) return
    reloadFromStorage()
    loaded.value = true

    if (typeof window !== 'undefined' && !listenersBound) {
      window.addEventListener('storage', onExternalStorage)
      window.addEventListener('beforeunload', persist.flush)
      document.addEventListener('visibilitychange', onWindowHidden)
      listenersBound = true
    }
  }

  function createNote(input?: Partial<NewNoteInput>): Note {
    const now = Date.now()
    const note: Note = {
      id: createId(),
      title: input?.title ?? '',
      todos: input?.todos ? JSON.parse(JSON.stringify(input.todos)) : [],
      createdAt: now,
      updatedAt: now,
    }
    notes.value.push(note)
    schedulePersist()
    return note
  }

  /** Replace an existing note's editable content. No-op if it was deleted elsewhere. */
  function updateNote(id: string, patch: NewNoteInput): boolean {
    const target = getNote(id)
    if (!target) return false
    target.title = patch.title
    target.todos = JSON.parse(JSON.stringify(patch.todos))
    target.updatedAt = Date.now()
    schedulePersist()
    return true
  }

  function deleteNote(id: string) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index === -1) return
    notes.value.splice(index, 1)
    schedulePersist()
  }

  /** Test seam: swap the storage backend and reload. */
  function _useStorage(next: NotesStorage) {
    storage = next
    loaded.value = false
  }

  return {
    notes,
    loaded,
    sortedNotes,
    getNote,
    hasNote,
    init,
    createNote,
    updateNote,
    deleteNote,
    flush: persist.flush,
    _useStorage,
  }
})
