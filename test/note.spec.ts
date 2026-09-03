import { describe, expect, it } from 'vitest'
import { isNoteEmpty, noteTitle, previewTodos, sanitizeNoteContent } from '~/utils/note'
import type { Todo } from '~/types/note'

const todos = (n: number): Todo[] =>
  Array.from({ length: n }, (_, i) => ({ id: `t${i}`, text: `item ${i}`, done: false }))

describe('sanitizeNoteContent', () => {
  it('trims the title', () => {
    expect(sanitizeNoteContent({ title: '  Покупки  ', todos: [] }).title).toBe('Покупки')
  })

  it('trims todo text and drops the empty ones', () => {
    const result = sanitizeNoteContent({
      title: '',
      todos: [
        { id: 'a', text: '  Молоко ', done: false },
        { id: 'b', text: '   ', done: false },
        { id: 'c', text: '', done: true },
        { id: 'd', text: 'Хлеб', done: false },
      ],
    })
    expect(result.todos).toEqual([
      { id: 'a', text: 'Молоко', done: false },
      { id: 'd', text: 'Хлеб', done: false },
    ])
  })

  it('keeps a real title while dropping every empty todo', () => {
    const result = sanitizeNoteContent({
      title: 'Покупки',
      todos: [
        { id: 'a', text: '', done: false },
        { id: 'b', text: '  ', done: false },
      ],
    })
    expect(result).toEqual({ title: 'Покупки', todos: [] })
  })

  it('keeps done state and ids of surviving todos', () => {
    const result = sanitizeNoteContent({
      title: 'x',
      todos: [{ id: 't1', text: ' done ', done: true }],
    })
    expect(result.todos[0]).toEqual({ id: 't1', text: 'done', done: true })
  })

  it('does not mutate the input', () => {
    const input = { title: ' a ', todos: [{ id: 't', text: ' b ', done: false }] }
    sanitizeNoteContent(input)
    expect(input.title).toBe(' a ')
    expect(input.todos[0]!.text).toBe(' b ')
  })
})

describe('noteTitle', () => {
  it('uses the trimmed title when present', () => {
    expect(noteTitle({ title: '  Покупки  ', todos: [] })).toBe('Покупки')
  })

  it('borrows the first non-empty todo when there is no title', () => {
    expect(
      noteTitle({
        title: '',
        todos: [
          { id: 'a', text: '  ', done: false },
          { id: 'b', text: ' Купить молоко ', done: false },
          { id: 'c', text: 'Хлеб', done: false },
        ],
      }),
    ).toBe('Купить молоко')
  })

  it('falls back to a placeholder when there is nothing at all', () => {
    expect(noteTitle({ title: '', todos: [{ id: 'a', text: '', done: false }] })).toBe(
      'Без названия',
    )
  })
})

describe('isNoteEmpty', () => {
  it('is true with no title and no todo text', () => {
    expect(isNoteEmpty({ title: '  ', todos: [] })).toBe(true)
    expect(isNoteEmpty({ title: '', todos: [{ id: 'a', text: '   ', done: false }] })).toBe(true)
  })

  it('is false with a title', () => {
    expect(isNoteEmpty({ title: 'X', todos: [] })).toBe(false)
  })

  it('is false with any todo text', () => {
    expect(isNoteEmpty({ title: '', todos: [{ id: 'a', text: 'y', done: false }] })).toBe(false)
  })
})

describe('previewTodos', () => {
  it('shows all todos when there are fewer than max', () => {
    const r = previewTodos(todos(2), 3)
    expect(r.visible).toHaveLength(2)
    expect(r.hiddenCount).toBe(0)
  })

  it('shows all todos when the count equals max', () => {
    const r = previewTodos(todos(3), 3)
    expect(r.visible).toHaveLength(3)
    expect(r.hiddenCount).toBe(0)
  })

  it('shows the extra item instead of "+1 more" when exactly one would be hidden', () => {
    const r = previewTodos(todos(4), 3)
    expect(r.visible).toHaveLength(4)
    expect(r.hiddenCount).toBe(0)
  })

  it('cuts at max and reports the hidden count when 2+ would be hidden', () => {
    const r = previewTodos(todos(5), 3)
    expect(r.visible).toHaveLength(3)
    expect(r.hiddenCount).toBe(2)
  })

  it('handles larger overflows', () => {
    const r = previewTodos(todos(10), 3)
    expect(r.visible.map((t) => t.id)).toEqual(['t0', 't1', 't2'])
    expect(r.hiddenCount).toBe(7)
  })

  it('handles an empty list', () => {
    const r = previewTodos([], 3)
    expect(r.visible).toEqual([])
    expect(r.hiddenCount).toBe(0)
  })

  it('does not mutate the input array', () => {
    const input = todos(5)
    previewTodos(input, 3)
    expect(input).toHaveLength(5)
  })
})
