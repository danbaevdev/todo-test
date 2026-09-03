<script setup lang="ts">
import { computed } from 'vue'
import { noteTitle } from '~/utils/note'
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ delete: [] }>()

const doneCount = computed(() => props.note.todos.filter((t) => t.done).length)
const title = computed(() => noteTitle(props.note))
/** Don't repeat the todo that's already shown as the title. */
const previewTodos = computed(() =>
  props.note.todos.filter((t) => t.id !== title.value.fromTodoId),
)
/** Show the preview unless every todo was absorbed into the title. */
const showPreview = computed(
  () => previewTodos.value.length > 0 || props.note.todos.length === 0,
)
</script>

<template>
  <article class="note-card">
    <div class="note-card__head">
      <h2
        class="note-card__title line-clamp-2"
        :class="{ 'note-card__title--untitled': title.isFallback }"
      >
        {{ title.text }}
      </h2>
      <span v-if="note.todos.length" class="note-card__count">
        {{ doneCount }} / {{ note.todos.length }}
      </span>
    </div>

    <TodoPreviewList v-if="showPreview" :todos="previewTodos" :max="3" />

    <div class="note-card__actions">
      <Button :to="`/notes/${note.id}`" variant="outline">Редактировать</Button>
      <Button color="danger" @click="emit('delete')">Удалить</Button>
    </div>
  </article>
</template>

<style scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.note-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.note-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.note-card__count {
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.note-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  /* Pin to the bottom so action rows line up across cards of unequal height. */
  margin-top: auto;
  padding-top: var(--space-1);
}
</style>
