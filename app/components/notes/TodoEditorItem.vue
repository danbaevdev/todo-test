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
      clearable
      :model-value="todo.text"
      placeholder="Что нужно сделать?"
      aria-label="Текст пункта"
      @update:model-value="emit('editText', $event)"
      @pause="emit('pause')"
      @commit="emit('commit')"
    />
    <Button icon variant="outline" color="danger" label="Удалить пункт" @click="emit('remove')">
      <Icon name="trash" />
    </Button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
