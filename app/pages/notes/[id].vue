<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEditHistory } from '~/composables/useEditHistory'
import { useNoteDraft } from '~/composables/useNoteDraft'
import { useUndoRedoShortcuts } from '~/composables/useUndoRedoShortcuts'
import { useNotesStore } from '~/stores/notes'
import type { Note } from '~/types/note'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const id = route.params.id as string

const source = store.getNote(id)
if (!source) {
  throw createError({ statusCode: 404, statusMessage: 'Заметка не найдена', fatal: true })
}

const history = useEditHistory(source)
const { note, canUndo, canRedo } = history

function serialize(value: Pick<Note, 'title' | 'todos'>) {
  return JSON.stringify({ title: value.title, todos: value.todos })
}

const deletedElsewhere = ref(false)

const isDirty = computed(() => {
  const current = store.getNote(id)
  if (!current) return true
  return serialize(note.value) !== serialize(current)
})

// --- Draft recovery --------------------------------------------------------
const draft = useNoteDraft(id, note, isDirty)
const showDraftPrompt = ref(draft.existingDraft !== null)

function restoreDraft() {
  if (draft.existingDraft) history.reset(draft.existingDraft.note)
  showDraftPrompt.value = false
}
function discardDraft() {
  draft.clear()
  showDraftPrompt.value = false
}

// --- External deletion (other tab) ---------------------------------------
watch(
  () => store.hasNote(id),
  (exists) => {
    if (!exists) deletedElsewhere.value = true
  },
)

// --- Confirmations -------------------------------------------------------
type Pending = 'cancel' | 'remove' | null
const pending = ref<Pending>(null)
const anyModalOpen = computed(() => pending.value !== null || showDraftPrompt.value)

useUndoRedoShortcuts({
  undo: history.undo,
  redo: history.redo,
  enabled: () => !anyModalOpen.value,
})

function leave() {
  draft.clear()
  router.push('/')
}

function save() {
  history.seal()
  const payload = {
    title: note.value.title.trim(),
    todos: note.value.todos.map((t) => ({ ...t, text: t.text.trim() })),
  }
  const ok = store.updateNote(id, payload)
  if (!ok) store.createNote(payload) // was deleted elsewhere — re-create
  store.flush()
  leave()
}

function requestCancel() {
  if (isDirty.value) pending.value = 'cancel'
  else leave()
}

function confirmPending() {
  if (pending.value === 'remove') store.deleteNote(id)
  pending.value = null
  leave()
}

// --- Todo actions -> history -------------------------------------------
const lastAddedId = ref<string | null>(null)

function onEditText(todoId: string, value: string) {
  history.setTodoText(todoId, value)
}

function addTodo() {
  lastAddedId.value = history.addTodo()
}

/** Go back if we came from somewhere in the app, otherwise to the notes list. */
function goBack() {
  if (typeof router.options.history.state.back === 'string') router.back()
  else router.push('/')
}
</script>

<template>
  <div class="editor">
    <Button class="editor__back" variant="ghost" @click="goBack">
      <IconArrowLeft :size="16" />
      Все заметки
    </Button>

    <NoteEditorToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :dirty="isDirty"
      @save="save"
      @cancel="requestCancel"
      @remove="pending = 'remove'"
      @undo="history.undo"
      @redo="history.redo"
    />

    <NoteDeletedNotice v-if="deletedElsewhere" />

    <NoteTitleField
      :model-value="note.title"
      @update:model-value="history.setTitle($event)"
      @pause="history.seal"
      @commit="history.seal"
    />

    <section class="editor__todos">
      <h2>Пункты</h2>
      <TodoEditorList
        :todos="note.todos"
        :autofocus-id="lastAddedId"
        @toggle="history.toggleTodo($event)"
        @edit-text="onEditText"
        @pause="history.seal"
        @commit="history.seal"
        @remove="history.removeTodo($event)"
        @add="addTodo"
      />
    </section>

    <ConfirmDialog
      v-if="pending === 'cancel'"
      title="Отменить редактирование?"
      message="Несохранённые изменения будут потеряны."
      confirm-label="Отменить изменения"
      danger
      @confirm="confirmPending"
      @cancel="pending = null"
    />

    <ConfirmDialog
      v-if="pending === 'remove'"
      title="Удалить заметку?"
      message="Заметка будет удалена без возможности восстановления."
      confirm-label="Удалить"
      danger
      @confirm="confirmPending"
      @cancel="pending = null"
    />

    <ConfirmDialog
      v-if="showDraftPrompt"
      title="Восстановить черновик?"
      message="Найдены несохранённые изменения этой заметки. Восстановить их?"
      confirm-label="Восстановить"
      cancel-label="Начать заново"
      @confirm="restoreDraft"
      @cancel="discardDraft"
    />
  </div>
</template>

<style scoped>
.editor {
  display: grid;
  gap: var(--space-5);
}

/* Ghost button pulled left by its own inline padding so the label sits on the grid edge. */
.editor__back {
  justify-self: start;
  margin-left: calc(var(--space-4) * -1);
  color: var(--color-text-muted);
}

.editor__todos {
  display: grid;
  gap: var(--space-3);
}
</style>
