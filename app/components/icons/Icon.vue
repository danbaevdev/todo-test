<script setup lang="ts">
import { computed } from 'vue'
import { ICONS, type IconDef, type IconName } from './icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    /** Rendered width/height in px (or any CSS length). */
    size?: number | string
  }>(),
  { size: 18 },
)

const icon = computed<IconDef>(() => ICONS[props.name])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icon.viewBox"
    fill="none"
    aria-hidden="true"
  >
    <path
      :d="icon.d"
      stroke="currentColor"
      :stroke-width="icon.strokeWidth ?? 1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
