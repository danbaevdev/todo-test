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
      <IconButton label="Отменить (Ctrl+Z)" :disabled="!canUndo" @click="emit('undo')">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M8 5L3 9l5 4M3 9h9a5 5 0 010 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>
      <IconButton label="Повторить (Shift+Ctrl+Z)" :disabled="!canRedo" @click="emit('redo')">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12 5l5 4-5 4M17 9H8a5 5 0 000 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>
    </div>

    <div class="toolbar__main">
      <Button variant="ghost" @click="emit('remove')">Удалить</Button>
      <Button variant="ghost" @click="emit('cancel')">Отменить редактирование</Button>
      <Button variant="primary" :disabled="!dirty" @click="emit('save')">Сохранить</Button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) 0;
}

.toolbar__history,
.toolbar__main {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.toolbar__main {
  flex-wrap: wrap;
}
</style>
