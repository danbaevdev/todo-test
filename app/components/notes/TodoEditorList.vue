<script setup lang="ts">
import type { Todo } from '~/types/note'

defineProps<{ todos: Todo[]; autofocusId?: string | null }>()

const emit = defineEmits<{
  toggle: [string]
  editText: [string, string]
  pause: []
  commit: []
  remove: [string]
  add: []
}>()
</script>

<template>
  <div class="todo-list">
    <ul v-if="todos.length" class="todo-list__items">
      <TodoEditorItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :autofocus="todo.id === autofocusId"
        @toggle="emit('toggle', todo.id)"
        @edit-text="emit('editText', todo.id, $event)"
        @pause="emit('pause')"
        @commit="emit('commit')"
        @remove="emit('remove', todo.id)"
      />
    </ul>
    <p v-else class="todo-list__empty">Пунктов пока нет.</p>

    <Button variant="ghost" @click="emit('add')">+ Добавить пункт</Button>
  </div>
</template>

<style scoped>
.todo-list {
  display: grid;
  gap: var(--space-3);
}

.todo-list__items {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}

.todo-list__empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
