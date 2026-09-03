<script setup lang="ts">
import {ariaKeyshortcuts} from '~/utils/platform'

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

const undoShortcut = {key: 'Z'} as const
const redoShortcut = {key: 'Z', shift: true} as const
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__extra">
      <Button variant="outline" color="danger" @click="emit('remove')">Удалить</Button>
      <Button variant="outline" @click="emit('cancel')">Отменить редактирование</Button>
    </div>

    <div class="toolbar__actions">
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

      <Button class="toolbar__save" color="primary" :disabled="!canSave" @click="emit('save')">
        Сохранить
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* --- Mobile: secondary actions at the top, a fixed bottom bar for the rest -- */
.toolbar {
  display: contents;
}

.toolbar__extra {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.toolbar__actions {
  position: fixed;
  inset: auto 0 0;
  z-index: var(--z-sticky);
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.toolbar__history {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.toolbar__history :deep(.tooltip-trigger) {
  display: flex;
}

.toolbar__history :deep(.btn) {
  width: 100%;
  height: var(--control-height-lg);
}

.toolbar__save {
  width: 100%;
  min-height: var(--control-height-lg);
}

.toolbar__hint {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}

/* --- Desktop: everything back into one inline row ------------------------- */
@media (--bp-md) {
  .toolbar {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
  }

  .toolbar__actions {
    display: contents;
  }

  .toolbar__history {
    order: 1;
    display: flex;
    gap: var(--space-2);
  }

  /* Restore the icon-button shape (a touch wider than tall). */
  .toolbar__history :deep(.btn) {
    width: calc(var(--icon-h) + var(--space-2));
    height: var(--icon-h);
  }

  .toolbar__extra {
    order: 2;
    margin-left: auto;
  }

  .toolbar__save {
    order: 3;
    width: auto;
    min-height: var(--control-height);
  }
}
</style>
