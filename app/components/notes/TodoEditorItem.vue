<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Todo } from '~/types/note'

const props = defineProps<{ todo: Todo; autofocus?: boolean }>()

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.autofocus) {
    root.value?.querySelector<HTMLInputElement>('input[type="text"], textarea')?.focus()
  }
})

const emit = defineEmits<{
  toggle: []
  editText: [string]
  pause: []
  commit: []
  remove: []
}>()
</script>

<template>
  <li ref="root" class="todo-item">
    <Checkbox :model-value="todo.done" @update:model-value="emit('toggle')" />
    <TextField
      :model-value="todo.text"
      placeholder="Текст пункта"
      aria-label="Текст пункта"
      :invalid="todo.text.trim() === ''"
      @update:model-value="emit('editText', $event)"
      @pause="emit('pause')"
      @commit="emit('commit')"
    />
    <IconButton label="Удалить пункт" variant="danger" @click="emit('remove')">
      <IconTrash />
    </IconButton>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
