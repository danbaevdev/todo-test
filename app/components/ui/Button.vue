<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'ghost', type: 'button', disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', `btn--${variant}`]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--control-height);
  padding: var(--space-1) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
.btn--primary:not(:disabled):hover {
  background: var(--color-primary-hover);
}

.btn--ghost {
  background: var(--color-surface);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
.btn--ghost:not(:disabled):hover {
  background: var(--color-surface-alt);
}

.btn--danger {
  background: var(--color-danger);
  color: var(--color-text-inverse);
}
.btn--danger:not(:disabled):hover {
  background: var(--color-danger-hover);
}
</style>
