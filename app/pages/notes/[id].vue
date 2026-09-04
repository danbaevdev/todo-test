<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <NoteEditor :key="route.params.id as string" :note-id="route.params.id as string" />
</template>
