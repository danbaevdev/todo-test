<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  'update:modelValue': [string]
  pause: []
  commit: []
}>()
</script>

<template>
  <div class="title-field">
    <label class="title-field__label" for="note-title">Название заметки</label>
    <TextField
      id="note-title"
      :model-value="modelValue"
      placeholder="Без названия"
      aria-label="Название заметки"
      @update:model-value="emit('update:modelValue', $event)"
      @pause="emit('pause')"
      @commit="emit('commit')"
    />
  </div>
</template>

<style scoped lang="scss">
.title-field {
  display: grid;
  gap: space(2);

  &__label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
  }
}
</style>
