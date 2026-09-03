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
        <IconUndo :size="15" />
      </IconButton>
      <IconButton label="Повторить (Shift+Ctrl+Z)" :disabled="!canRedo" @click="emit('redo')">
        <IconRedo :size="15" />
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
