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
      <Button icon variant="outline" label="Отменить (Ctrl+Z)" :disabled="!canUndo" @click="emit('undo')">
        <Icon name="undo" />
      </Button>
      <Button icon variant="outline" label="Повторить (Shift+Ctrl+Z)" :disabled="!canRedo" @click="emit('redo')">
        <Icon name="redo" />
      </Button>
    </div>

    <div class="toolbar__main">
      <Button variant="outline" color="danger" @click="emit('remove')">Удалить</Button>
      <Button variant="outline" @click="emit('cancel')">Отменить редактирование</Button>
      <Button color="primary" :disabled="!dirty" @click="emit('save')">Сохранить</Button>
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
