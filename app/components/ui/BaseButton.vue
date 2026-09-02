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

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: space(2);
  padding: space(2) space(4);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @include focus-ring-visible;

  &--primary {
    background: var(--color-primary);
    color: var(--color-text-inverse);

    &:not(:disabled):hover { background: var(--color-primary-hover); }
  }

  &--ghost {
    background: var(--color-surface);
    border-color: var(--color-border-strong);
    color: var(--color-text);

    &:not(:disabled):hover { background: var(--color-surface-alt); }
  }

  &--danger {
    background: var(--color-danger);
    color: var(--color-text-inverse);

    &:not(:disabled):hover { background: var(--color-danger-hover); }
  }
}
</style>
