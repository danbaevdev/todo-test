<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '~/types/note'

const props = withDefaults(
  defineProps<{ todos: Todo[]; max?: number }>(),
  { max: 3 },
)

const visible = computed(() => props.todos.slice(0, props.max))
const hiddenCount = computed(() => Math.max(0, props.todos.length - props.max))
</script>

<template>
  <div class="preview">
    <ul v-if="visible.length" class="preview__list">
      <TodoPreviewItem v-for="todo in visible" :key="todo.id" :todo="todo" />
    </ul>
    <p v-else class="preview__empty">Нет пунктов</p>
    <p v-if="hiddenCount" class="preview__more">и ещё {{ hiddenCount }}…</p>
  </div>
</template>

<style scoped lang="scss">
.preview {
  display: grid;
  gap: space(2);

  &__list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: space(1);
  }

  &__empty,
  &__more {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }
}
</style>
