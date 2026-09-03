import {computed, ref} from 'vue'
import {createId} from '~/utils/id'
import type {Note, Todo} from '~/types/note'

/**
 * Manual undo/redo for a single editing session.
 *
 * Design notes:
 * - History stores per-operation diffs, never full note copies, so the 50-step
 *   limit costs O(1) memory per step.
 * - Continuous typing into one field collapses into a single entry: the entry is
 *   mutated in place until `seal()` is called (on blur or a typing pause).
 * - Checkbox toggles and add/remove are always atomic (they seal first).
 * - A new operation after undo drops the redo branch.
 */

export const HISTORY_LIMIT = 50

type Op =
  | {kind: 'set-title'; before: string; after: string}
  | {kind: 'toggle-todo'; todoId: string; before: boolean; after: boolean}
  | {kind: 'edit-todo-text'; todoId: string; before: string; after: string}
  | {kind: 'add-todo'; index: number; todo: Todo}
  | {kind: 'remove-todo'; index: number; todo: Todo}

function clone<T>(value: T): T {
  // JSON clone: strips Vue reactive proxies and is sufficient for plain note data.
  return JSON.parse(JSON.stringify(value)) as T
}

export function useEditHistory(initial: Note) {
  const note = ref<Note>(clone(initial))
  const past = ref<Op[]>([])
  const future = ref<Op[]>([])

  /** Coalesce key of the entry still open for in-place merging, if any. */
  let pendingKey: string | null = null

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  function findTodo(todoId: string): Todo | undefined {
    return note.value.todos.find(t => t.id === todoId)
  }

  function applyForward(op: Op) {
    switch (op.kind) {
      case 'set-title':
        note.value.title = op.after
        break
      case 'toggle-todo': {
        const t = findTodo(op.todoId)
        if (t) t.done = op.after
        break
      }
      case 'edit-todo-text': {
        const t = findTodo(op.todoId)
        if (t) t.text = op.after
        break
      }
      case 'add-todo':
        note.value.todos.splice(op.index, 0, clone(op.todo))
        break
      case 'remove-todo':
        note.value.todos.splice(op.index, 1)
        break
    }
  }

  function applyInverse(op: Op) {
    switch (op.kind) {
      case 'set-title':
        note.value.title = op.before
        break
      case 'toggle-todo': {
        const t = findTodo(op.todoId)
        if (t) t.done = op.before
        break
      }
      case 'edit-todo-text': {
        const t = findTodo(op.todoId)
        if (t) t.text = op.before
        break
      }
      case 'add-todo':
        note.value.todos.splice(op.index, 1)
        break
      case 'remove-todo':
        note.value.todos.splice(op.index, 0, clone(op.todo))
        break
    }
  }

  function pushOp(op: Op) {
    future.value = []
    past.value.push(op)
    if (past.value.length > HISTORY_LIMIT) past.value.shift()
  }

  /** Record a coalescing text op, merging into the open entry when possible. */
  function pushCoalescing(key: string, op: Op, mergeAfter: (existing: Op) => void) {
    const top = past.value[past.value.length - 1]
    if (pendingKey === key && top && future.value.length === 0) {
      mergeAfter(top)
    } else {
      pushOp(op)
      pendingKey = key
    }
  }

  // --- Public mutations -------------------------------------------------------

  function setTitle(value: string) {
    if (value === note.value.title) return
    pushCoalescing(
      'set-title',
      {kind: 'set-title', before: note.value.title, after: value},
      existing => {
        if (existing.kind === 'set-title') existing.after = value
      },
    )
    note.value.title = value
  }

  function setTodoText(todoId: string, value: string) {
    const todo = findTodo(todoId)
    if (!todo || todo.text === value) return
    pushCoalescing(
      `edit-todo-text:${todoId}`,
      {kind: 'edit-todo-text', todoId, before: todo.text, after: value},
      existing => {
        if (existing.kind === 'edit-todo-text') existing.after = value
      },
    )
    todo.text = value
  }

  function toggleTodo(todoId: string) {
    seal()
    const todo = findTodo(todoId)
    if (!todo) return
    pushOp({kind: 'toggle-todo', todoId, before: todo.done, after: !todo.done})
    todo.done = !todo.done
  }

  function addTodo(text = ''): string {
    seal()
    const todo: Todo = {id: createId(), text, done: false}
    const index = note.value.todos.length
    pushOp({kind: 'add-todo', index, todo: clone(todo)})
    note.value.todos.splice(index, 0, todo)
    return todo.id
  }

  function removeTodo(todoId: string) {
    seal()
    const index = note.value.todos.findIndex(t => t.id === todoId)
    if (index === -1) return
    pushOp({kind: 'remove-todo', index, todo: clone(note.value.todos[index]!)})
    note.value.todos.splice(index, 1)
  }

  /** Close the currently open coalescing entry (call on blur / typing pause). */
  function seal() {
    pendingKey = null
  }

  function undo() {
    seal()
    const op = past.value.pop()
    if (!op) return
    applyInverse(op)
    future.value.push(op)
  }

  function redo() {
    seal()
    const op = future.value.pop()
    if (!op) return
    applyForward(op)
    past.value.push(op)
  }

  /** Replace the base note and wipe history (on save / cancel editing). */
  function reset(next: Note) {
    note.value = clone(next)
    past.value = []
    future.value = []
    pendingKey = null
  }

  return {
    note,
    canUndo,
    canRedo,
    historyDepth: computed(() => past.value.length),
    setTitle,
    setTodoText,
    toggleTodo,
    addTodo,
    removeTodo,
    seal,
    undo,
    redo,
    reset,
  }
}

export type EditHistory = ReturnType<typeof useEditHistory>
