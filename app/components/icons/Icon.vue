<script setup lang="ts">
import {ICONS, type IconName} from './icons'

defineProps<{name: IconName}>()
</script>

<template>
  <!-- Sized via CSS: 1em scales with the parent's font-size. -->
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      :d="ICONS[name]"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
