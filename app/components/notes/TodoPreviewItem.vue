<script setup lang="ts">
import type { Todo } from '~/types/note'

defineProps<{ todo: Todo }>()
</script>

<template>
  <li class="preview-item">
    <Checkbox :model-value="todo.done" readonly />
    <span class="preview-item__text line-clamp-1" :class="{ 'preview-item__text--done': todo.done }">
      {{ todo.text || 'Без текста' }}
    </span>
  </li>
</template>

<style scoped lang="scss">
.preview-item {
  display: flex;
  align-items: center;
  gap: space(2);
  min-width: 0;

  &__text {
    font-size: var(--font-size-sm);
    color: var(--color-text);

    &--done {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }
  }
}
</style>
