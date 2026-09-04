<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import {useEditHistory} from '~/composables/useEditHistory'
import {useNoteDraft} from '~/composables/useNoteDraft'
import {useUndoRedoShortcuts} from '~/composables/useUndoRedoShortcuts'
import {useNotesStore} from '~/stores/notes'
import {createId} from '~/utils/id'
import {isNoteEmpty, sanitizeNoteContent} from '~/utils/note'
import type {Note} from '~/types/note'

/** No `noteId` → creating a brand-new note that only hits the store on save. */
const props = defineProps<{noteId?: string}>()

const router = useRouter()
const store = useNotesStore()

const isCreate = !props.noteId
/** Draft key: the note id when editing, the reserved "new note" slot when
 *  creating (see RESERVED_DRAFT_IDS in utils/storage). */
const draftId = props.noteId ?? 'new'

function serialize(value: Pick<Note, 'title' | 'todos'>) {
  return JSON.stringify({title: value.title, todos: value.todos})
}

let source: Note
if (props.noteId) {
  const found = store.getNote(props.noteId)
  if (!found) {
    throw createError({statusCode: 404, statusMessage: 'Заметка не найдена', fatal: true})
  }
  source = found
} else {
  source = {id: createId(), title: '', todos: [], createdAt: Date.now(), updatedAt: Date.now()}
}
/** Baseline for the create-mode dirty check (an untouched blank note). */
const blank = serialize(source)

const history = useEditHistory(source)
const {note, canUndo, canRedo} = history

const deletedElsewhere = ref(false)
/** Set once we start navigating away, so our own teardown delete (an empty
 *  note dropped in the route guard) isn't mistaken for an external deletion. */
let leaving = false

const isDirty = computed(() => {
  if (isCreate) return serialize(note.value) !== blank
  const current = store.getNote(props.noteId!)
  if (!current) return true
  return serialize(note.value) !== serialize(current)
})

/** Nothing to save while the note is empty or unchanged. */
const canSave = computed(() => isDirty.value && !isNoteEmpty(note.value))

// --- Draft recovery --------------------------------------------------------
const draft = useNoteDraft(draftId, note, isDirty)
const showDraftPrompt = ref(draft.existingDraft !== null)

function restoreDraft() {
  if (draft.existingDraft) history.reset(draft.existingDraft.note)
  showDraftPrompt.value = false
}
function discardDraft() {
  draft.clear()
  showDraftPrompt.value = false
}

// --- External deletion (other tab) — edit mode only ---------------------
if (!isCreate) {
  watch(
    () => store.hasNote(props.noteId!),
    exists => {
      if (!exists && !leaving) deletedElsewhere.value = true
    },
  )
}

// --- Confirmations -------------------------------------------------------
type Pending = 'cancel' | 'remove' | null
const pending = ref<Pending>(null)
const anyModalOpen = computed(() => pending.value !== null || showDraftPrompt.value)

useUndoRedoShortcuts({
  undo: history.undo,
  redo: history.redo,
  enabled: () => !anyModalOpen.value,
})

/**
 * Teardown for a confirmed exit: forget the draft, and (edit mode) drop the
 * note entirely if it never got a title or a single todo — an empty note isn't
 * worth keeping (Apple Notes behaves the same way).
 */
function finishLeave() {
  draft.clear()
  if (!isCreate && store.hasNote(props.noteId!) && isNoteEmpty(note.value)) {
    store.deleteNote(props.noteId!)
  }
  store.flush()
}

/**
 * Catch every way out of the editor, including the browser Back button and
 * links elsewhere in the app. Our own buttons set `leaving` first, so they
 * pass straight through; anything else with unsaved changes is stopped and
 * routed through the confirm dialog.
 */
onBeforeRouteLeave(() => {
  if (leaving) {
    finishLeave()
    return true
  }
  if (isDirty.value) {
    pending.value = 'cancel'
    return false
  }
  finishLeave()
  return true
})

/** Tab close / reload / external URL — only the native prompt is possible. */
function onBeforeUnload(event: BeforeUnloadEvent) {
  if (isDirty.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

function leave() {
  leaving = true
  router.push('/')
}

/** Back to wherever we came from, else the notes list. */
function navigateBack() {
  leaving = true
  if (typeof router.options.history.state.back === 'string') router.back()
  else router.push('/')
}

/**
 * Shared exit path for the "Все заметки" link and "Отменить редактирование":
 * leave straight away when nothing changed, otherwise ask first.
 */
function attemptExit() {
  if (isDirty.value) pending.value = 'cancel'
  else navigateBack()
}

function save() {
  history.seal()
  if (!isNoteEmpty(note.value)) {
    const payload = sanitizeNoteContent(note.value)
    // updateNote returns false if the note was deleted elsewhere → recreate it.
    if (isCreate || !store.updateNote(props.noteId!, payload)) store.createNote(payload)
  }
  leave() // the route guard persists / discards
}

function confirmPending() {
  if (pending.value === 'remove') {
    if (!isCreate) store.deleteNote(props.noteId!)
    pending.value = null
    leave()
    return
  }
  pending.value = null
  navigateBack()
}

// --- Todo actions -> history -------------------------------------------
/** Id of the last-added row, so it can be autofocused. */
const lastAddedId = ref<string | null>(null)

function onEditText(todoId: string, value: string) {
  history.setTodoText(todoId, value)
}

function addTodo() {
  lastAddedId.value = history.addTodo()
  // Bring the new row (and the add button) into view — it may be under the fold
  // or the fixed mobile toolbar.
  nextTick(() => {
    window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'})
  })
}

</script>

<template>
  <div class="editor">
    <NoteEditorToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :can-save="canSave"
      :can-delete="!isCreate"
      :cancel-label="isCreate ? 'Отмена' : 'Отменить редактирование'"
      @save="save"
      @cancel="attemptExit"
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
      :title="isCreate ? 'Отменить создание заметки?' : 'Отменить редактирование?'"
      :message="isCreate ? 'Заметка не будет сохранена.' : 'Несохранённые изменения будут потеряны.'"
      :confirm-label="isCreate ? 'Отменить создание' : 'Отменить изменения'"
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
  gap: var(--space-6);

  /* Room for the fixed bottom toolbar on mobile (2 rows + padding + safe area). */
  padding-bottom: calc(
    var(--control-height-lg) * 2 + var(--space-3) * 3 + env(safe-area-inset-bottom, 0px)
  );
}

@media (--bp-md) {
  .editor {
    padding-bottom: 0;
  }
}

.editor__todos {
  display: grid;
  gap: var(--space-3);
}
</style>
