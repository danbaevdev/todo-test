<script setup lang="ts">
import {formatShortcut, isMacOS, type ShortcutParts} from '~/utils/platform'

const props = defineProps<{shortcut: ShortcutParts}>()

const mac = isMacOS()
const winLabel = formatShortcut(props.shortcut, false)
</script>

<template>
  <kbd class="kbd">
    <template v-if="mac">
      <Icon v-if="shortcut.shift" name="shift" />
      <Icon name="command" />
      {{ shortcut.key }}
    </template>
    <template v-else>{{ winLabel }}</template>
  </kbd>
</template>

<style scoped>
.kbd {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  font-family: var(--font-family-base);
  font-size: 0.9em;
  padding: 0 var(--space-1);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, currentcolor 14%, transparent);
}
</style>
