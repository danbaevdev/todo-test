<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotesStore } from '~/stores/notes'
import type { Note } from '~/types/note'

const store = useNotesStore()
const { sortedNotes, loaded } = storeToRefs(store)
const router = useRouter()

const pendingDelete = ref<Note | null>(null)

function createNote() {
  const note = store.createNote()
  router.push(`/notes/${note.id}`)
}

function confirmDelete() {
  if (pendingDelete.value) store.deleteNote(pendingDelete.value.id)
  pendingDelete.value = null
}
</script>

<template>
  <div class="notes">
    <div class="notes__bar">
      <h1>Мои заметки</h1>
      <Button color="primary" @click="createNote">Новая заметка +</Button>
    </div>

    <template v-if="loaded">
      <EmptyNotesState v-if="!sortedNotes.length" />
      <div v-else class="notes__grid">
        <NoteCard
          v-for="note in sortedNotes"
          :key="note.id"
          :note="note"
          @delete="pendingDelete = note"
        />
      </div>
    </template>

    <ConfirmDialog
      v-if="pendingDelete"
      title="Удалить заметку?"
      :message="`Заметка «${pendingDelete.title || 'Без названия'}» будет удалена без возможности восстановления.`"
      confirm-label="Удалить"
      danger
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>

<style scoped>
.notes {
  display: grid;
  gap: var(--space-6);
}

.notes__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

/* auto-fill + minmax already collapses to one column on narrow screens */
.notes__grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
}
</style>
