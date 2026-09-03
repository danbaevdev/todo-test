<script setup lang="ts">
import type { Todo } from '~/types/note'

defineProps<{ todo: Todo }>()
</script>

<template>
  <li class="preview-item">
    <Checkbox :model-value="todo.done" readonly />
    <span
      class="preview-item__text line-clamp-1"
      :class="{
        'preview-item__text--done': todo.done,
        'preview-item__text--empty': !todo.text.trim(),
      }"
    >
      {{ todo.text.trim() || 'Без текста' }}
    </span>
  </li>
</template>

<style scoped>
.preview-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.preview-item__text {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.preview-item__text--done {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.preview-item__text--empty {
  color: var(--color-text-muted);
  font-style: italic;
}
</style>
