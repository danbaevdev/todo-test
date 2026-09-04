<script setup lang="ts">
import {ariaKeyshortcuts} from '~/utils/platform'

withDefaults(
  defineProps<{
    canUndo: boolean
    canRedo: boolean
    canSave: boolean
    /** New notes have nothing saved to delete — hide the button. */
    canDelete?: boolean
    /** "Отменить редактирование" when editing, "Отмена" when creating. */
    cancelLabel?: string
  }>(),
  {canDelete: true, cancelLabel: 'Отменить редактирование'},
)

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
  <!-- DOM order == desktop reading order == tab order: undo, redo, delete,
       cancel, save. Mobile rearranges purely with CSS position/grid. -->
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

    <div class="toolbar__extra">
      <Button v-if="canDelete" variant="outline" color="danger" @click="emit('remove')">
        Удалить
      </Button>
      <Button variant="outline" @click="emit('cancel')">{{ cancelLabel }}</Button>
    </div>

    <div class="toolbar__save-wrap">
      <Button class="toolbar__save" color="primary" :disabled="!canSave" @click="emit('save')">
        Сохранить
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* --- Mobile: delete/cancel at the top, a fixed bottom bar for the rest ----- */
.toolbar {
  /* height of the fixed save row (button + its bottom inset) */
  --save-row: calc(var(--control-height-lg) + var(--space-3) + env(safe-area-inset-bottom, 0px));

  display: contents;
}

.toolbar__extra {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.toolbar__history,
.toolbar__save-wrap {
  position: fixed;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: var(--color-surface);
  padding-inline: var(--space-3);
}

/* row 1: undo | redo, sitting right on top of the save row */
.toolbar__history {
  bottom: var(--save-row);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  padding-block: var(--space-3) var(--space-2);
  border-top: 1px solid var(--color-border);
}

.toolbar__history :deep(.tooltip-trigger) {
  display: flex;
}

.toolbar__history :deep(.btn) {
  width: 100%;
  height: var(--control-height-lg);
}

/* row 2: full-width Save */
.toolbar__save-wrap {
  bottom: 0;
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
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

/* --- Desktop: one inline row, visual order == DOM order ------------------- */
@media (--bp-md) {
  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    padding: var(--space-3) 0;
  }

  .toolbar__history {
    position: static;
    display: flex;
    gap: var(--space-2);
    padding: 0;
    background: none;
    border-top: 0;
  }

  /* Restore the icon-button shape (a touch wider than tall). */
  .toolbar__history :deep(.btn) {
    width: calc(var(--icon-h) + var(--space-2));
    height: var(--icon-h);
  }

  .toolbar__extra {
    margin-left: auto;
  }

  .toolbar__save-wrap {
    position: static;
    padding: 0;
    background: none;
  }

  .toolbar__save {
    width: auto;
    min-height: var(--control-height);
  }
}
</style>
