<script setup lang="ts">
defineProps<{
  canUndo: boolean
  canRedo: boolean
  dirty: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  remove: []
  undo: []
  redo: []
}>()
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__history">
      <BaseIconButton label="Отменить (Ctrl+Z)" :disabled="!canUndo" @click="emit('undo')">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M8 5L3 9l5 4M3 9h9a5 5 0 010 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </BaseIconButton>
      <BaseIconButton label="Повторить (Shift+Ctrl+Z)" :disabled="!canRedo" @click="emit('redo')">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12 5l5 4-5 4M17 9H8a5 5 0 000 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </BaseIconButton>
    </div>

    <div class="toolbar__main">
      <BaseButton variant="ghost" @click="emit('remove')">Удалить</BaseButton>
      <BaseButton variant="ghost" @click="emit('cancel')">Отменить редактирование</BaseButton>
      <BaseButton variant="primary" :disabled="!dirty" @click="emit('save')">Сохранить</BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: space(3);
  padding: space(3) 0;

  &__history,
  &__main {
    display: flex;
    align-items: center;
    gap: space(2);
  }

  &__main {
    flex-wrap: wrap;
  }
}
</style>
