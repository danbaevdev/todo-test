import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {nextTick} from 'vue'
import {mountSuspended} from '@nuxt/test-utils/runtime'
import type {Note} from '~/types/note'
import NoteEditor from '~/components/notes/NoteEditor.vue'

// Capture onBeforeRouteLeave — mountSuspended renders the component outside a
// <RouterView>, so real navigation never fires the guard; the test invokes it.
let leaveGuard: (() => unknown) | undefined
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: (cb: () => unknown) => {
      leaveGuard = cb
    },
  }
})

// Thin fake store so the test can assert exactly which calls delete a note.
const notes = new Map<string, Note>()
const deleteNote = vi.fn((id: string) => void notes.delete(id))
const updateNote = vi.fn(() => true)
const createNote = vi.fn()
vi.mock('~/stores/notes', () => ({
  useNotesStore: () => ({
    getNote: (id: string) => notes.get(id),
    hasNote: (id: string) => notes.has(id),
    deleteNote,
    updateNote,
    createNote,
    flush: vi.fn(),
  }),
}))

const sampleNote = (): Note => ({
  id: 'n1',
  title: 'Покупки',
  todos: [{id: 't1', text: 'Молоко', done: false}],
  createdAt: 1,
  updatedAt: 1,
})

beforeEach(() => {
  notes.clear()
  notes.set('n1', sampleNote())
  vi.clearAllMocks()
  leaveGuard = undefined
})

afterEach(() => window.localStorage.clear())

describe('NoteEditor — leaving an emptied note', () => {
  it('never deletes the stored note when the editor is cleared and editing is cancelled', async () => {
    const wrapper = await mountSuspended(NoteEditor, {props: {noteId: 'n1'}})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any

    // Wipe the note from inside the editor.
    vm.history.setTitle('')
    vm.history.removeTodo('t1')
    await nextTick()
    expect(vm.note.title).toBe('')
    expect(vm.note.todos).toHaveLength(0)

    // "Отмена" → confirm, then the route actually leaves.
    vm.pending = 'cancel'
    vm.confirmPending()
    leaveGuard?.()
    await nextTick()

    expect(deleteNote).not.toHaveBeenCalled()
    expect(notes.has('n1')).toBe(true)
  })

  it('deletes the note only through the explicit remove confirmation', async () => {
    const wrapper = await mountSuspended(NoteEditor, {props: {noteId: 'n1'}})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any

    vm.pending = 'remove'
    vm.confirmPending()

    expect(deleteNote).toHaveBeenCalledWith('n1')
  })
})
