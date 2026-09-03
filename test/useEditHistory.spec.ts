import {describe, expect, it} from 'vitest'
import {HISTORY_LIMIT, useEditHistory} from '~/composables/useEditHistory'
import {makeNote} from './helpers'

describe('useEditHistory', () => {
  it('coalesces continuous typing into one entry until sealed', () => {
    const h = useEditHistory(makeNote({title: ''}))

    h.setTitle('H')
    h.setTitle('He')
    h.setTitle('Hel')
    h.setTitle('Hello')

    expect(h.note.value.title).toBe('Hello')
    expect(h.historyDepth.value).toBe(1)

    h.undo()
    expect(h.note.value.title).toBe('')
    expect(h.canUndo.value).toBe(false)
  })

  it('starts a new entry after seal (blur / pause)', () => {
    const h = useEditHistory(makeNote({title: ''}))

    h.setTitle('foo')
    h.seal()
    h.setTitle('foobar')

    expect(h.historyDepth.value).toBe(2)
    h.undo()
    expect(h.note.value.title).toBe('foo')
    h.undo()
    expect(h.note.value.title).toBe('')
  })

  it('keeps separate coalescing entries per field', () => {
    const note = makeNote({
      title: '',
      todos: [
        {id: 't1', text: '', done: false},
        {id: 't2', text: '', done: false},
      ],
    })
    const h = useEditHistory(note)

    h.setTodoText('t1', 'a')
    h.setTodoText('t1', 'ab')
    h.setTodoText('t2', 'x')

    expect(h.historyDepth.value).toBe(2)
  })

  it('treats checkbox toggle, add and remove as atomic entries', () => {
    const h = useEditHistory(makeNote({todos: [{id: 't1', text: 'a', done: false}]}))

    h.toggleTodo('t1')
    h.toggleTodo('t1')
    const newId = h.addTodo('b')
    h.removeTodo(newId)

    expect(h.historyDepth.value).toBe(4)

    h.undo() // restore removed todo
    expect(h.note.value.todos.map(t => t.id)).toEqual(['t1', newId])
    h.undo() // remove added todo
    expect(h.note.value.todos).toHaveLength(1)
    h.undo() // untoggle
    expect(h.note.value.todos[0]!.done).toBe(true)
    h.undo() // untoggle
    expect(h.note.value.todos[0]!.done).toBe(false)
  })

  it('redo replays an undone operation', () => {
    const h = useEditHistory(makeNote({title: ''}))
    h.setTitle('done')
    h.seal()
    h.undo()
    expect(h.note.value.title).toBe('')
    h.redo()
    expect(h.note.value.title).toBe('done')
  })

  it('drops the redo branch when a new op follows an undo', () => {
    const h = useEditHistory(makeNote({title: ''}))
    h.setTitle('a')
    h.seal()
    h.setTitle('ab')
    h.seal()
    h.undo() // -> 'a', redo available
    expect(h.canRedo.value).toBe(true)

    h.setTitle('az')
    h.seal()
    expect(h.canRedo.value).toBe(false)
    h.redo()
    expect(h.note.value.title).toBe('az')
  })

  it('caps history at the limit without storing full note copies', () => {
    const h2 = useEditHistory(makeNote({title: 'base'}))
    for (let i = 0; i < HISTORY_LIMIT + 15; i++) {
      h2.setTitle(`v${i}`)
      h2.seal()
    }
    expect(h2.historyDepth.value).toBe(HISTORY_LIMIT)

    // Can only walk back HISTORY_LIMIT steps.
    let steps = 0
    while (h2.canUndo.value) {
      h2.undo()
      steps++
    }
    expect(steps).toBe(HISTORY_LIMIT)
    // Base drifted (older history discarded), not the pristine 'base'.
    expect(h2.note.value.title).toBe(`v${15 - 1}`)
  })

  it('reset wipes history and rebases', () => {
    const h = useEditHistory(makeNote({title: 'a'}))
    h.setTitle('b')
    h.seal()
    h.reset(makeNote({title: 'fresh'}))
    expect(h.note.value.title).toBe('fresh')
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)
  })
})
