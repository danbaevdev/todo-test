<script setup lang="ts">
import {computed} from 'vue'
import {previewTodos} from '~/utils/note'
import type {Todo} from '~/types/note'

const props = withDefaults(defineProps<{todos: Todo[]; max?: number}>(), {max: 3})

const preview = computed(() => previewTodos(props.todos, props.max))
</script>

<template>
  <div class="preview">
    <ul v-if="preview.visible.length" class="preview__list">
      <TodoPreviewItem v-for="todo in preview.visible" :key="todo.id" :todo="todo" />
    </ul>
    <p v-else class="preview__empty">Нет пунктов</p>
    <p v-if="preview.hiddenCount" class="preview__more">и ещё {{ preview.hiddenCount }}</p>
  </div>
</template>

<style scoped>
.preview {
  display: grid;
  gap: var(--space-2);
}

.preview__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-1);
}

.preview__empty,
.preview__more {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
