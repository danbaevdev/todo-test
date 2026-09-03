import { describe, expect, it } from 'vitest'
import { sanitizeNoteContent } from '~/utils/note'

describe('sanitizeNoteContent', () => {
  it('trims the title', () => {
    expect(sanitizeNoteContent({ title: '  Покупки  ', todos: [] }).title).toBe('Покупки')
  })

  it('trims todo text and drops empty ones', () => {
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
