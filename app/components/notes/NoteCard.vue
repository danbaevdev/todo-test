<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ delete: [] }>()

const doneCount = computed(() => props.note.todos.filter((t) => t.done).length)
</script>

<template>
  <article class="note-card">
    <div class="note-card__head">
      <h2 class="note-card__title">{{ note.title || 'Без названия' }}</h2>
      <span v-if="note.todos.length" class="note-card__count">
        {{ doneCount }} / {{ note.todos.length }}
      </span>
    </div>

    <TodoPreviewList :todos="note.todos" :max="3" />

    <div class="note-card__actions">
      <NuxtLink :to="`/notes/${note.id}`" class="note-card__edit">Редактировать</NuxtLink>
      <BaseButton variant="danger" @click="emit('delete')">Удалить</BaseButton>
    </div>
  </article>
</template>

<style scoped lang="scss">
.note-card {
  display: grid;
  gap: space(3);
  padding: space(4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: space(3);
  }

  &__title {
    font-size: var(--font-size-lg);
    @include line-clamp(2);
  }

  &__count {
    flex-shrink: 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: space(2);
    margin-top: space(1);
  }

  &__edit {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }
}
</style>
