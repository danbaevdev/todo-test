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
  <BaseModal :title="title" @close="emit('cancel')">
    <p>{{ message }}</p>
    <template #footer>
      <BaseButton variant="ghost" @click="emit('cancel')">{{ cancelLabel }}</BaseButton>
      <BaseButton :variant="danger ? 'danger' : 'primary'" @click="emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
