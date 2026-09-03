<script setup lang="ts">
import { ariaKeyshortcuts } from '~/utils/platform'

defineProps<{
  canUndo: boolean
  canRedo: boolean
  canSave: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  remove: []
  undo: []
  redo: []
}>()

const undoShortcut = { key: 'Z' } as const
const redoShortcut = { key: 'Z', shift: true } as const
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__history">
      <Tooltip placement="bottom">
        <Button
          icon
          no-title
          variant="outline"
          label="Отменить"
          :aria-keyshortcuts="ariaKeyshortcuts(undoShortcut)"
          :disabled="!canUndo"
          @click="emit('undo')"
        >
          <Icon name="undo" />
        </Button>
        <template #content>
          <span class="toolbar__hint">Отменить <KbdShortcut :shortcut="undoShortcut" /></span>
        </template>
      </Tooltip>

      <Tooltip placement="bottom">
        <Button
          icon
          no-title
          variant="outline"
          label="Повторить"
          :aria-keyshortcuts="ariaKeyshortcuts(redoShortcut)"
          :disabled="!canRedo"
          @click="emit('redo')"
        >
          <Icon name="redo" />
        </Button>
        <template #content>
          <span class="toolbar__hint">Повторить <KbdShortcut :shortcut="redoShortcut" /></span>
        </template>
      </Tooltip>
    </div>

    <div class="toolbar__main">
      <Button variant="outline" color="danger" @click="emit('remove')">Удалить</Button>
      <Button variant="outline" @click="emit('cancel')">Отменить редактирование</Button>
      <Button color="primary" :disabled="!canSave" @click="emit('save')">Сохранить</Button>
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

.toolbar__hint {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}
</style>
