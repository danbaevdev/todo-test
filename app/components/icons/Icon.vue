<script setup lang="ts">
import { ICONS, type IconName } from './icons'

withDefaults(
  defineProps<{
    name: IconName
    /** Rendered width/height in px (or any CSS length). */
    size?: number | string
  }>(),
  { size: 18 },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      :d="ICONS[name]"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
