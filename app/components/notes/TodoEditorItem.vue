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
    <BaseCheckbox :model-value="todo.done" @update:model-value="emit('toggle')" />
    <BaseTextField
      :model-value="todo.text"
      placeholder="Текст пункта"
      aria-label="Текст пункта"
      :invalid="todo.text.trim() === ''"
      @update:model-value="emit('editText', $event)"
      @pause="emit('pause')"
      @commit="emit('commit')"
    />
    <BaseIconButton label="Удалить пункт" variant="danger" @click="emit('remove')">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </BaseIconButton>
  </li>
</template>

<style scoped lang="scss">
.todo-item {
  display: flex;
  align-items: center;
  gap: space(3);
}
</style>
