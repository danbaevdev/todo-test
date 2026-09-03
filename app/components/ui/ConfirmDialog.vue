<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  { confirmLabel: 'Подтвердить', cancelLabel: 'Отмена', danger: false },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Modal :title="title" @close="emit('cancel')">
    <p>{{ message }}</p>
    <template #footer>
      <Button variant="ghost" @click="emit('cancel')">{{ cancelLabel }}</Button>
      <Button :variant="danger ? 'danger' : 'primary'" @click="emit('confirm')">
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>
