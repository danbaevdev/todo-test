<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Accessible name — the button has no visible text. */
    label: string
    disabled?: boolean
    variant?: 'default' | 'danger'
  }>(),
  { disabled: false, variant: 'default' },
)
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="`icon-button--${variant}`"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // Same height as Button; a touch wider than tall.
  height: var(--control-height);
  width: calc(var(--control-height) + var(--space-2));
  padding: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);

  &:not(:disabled):hover {
    background: var(--color-surface-alt);
    color: var(--color-text);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &--danger:not(:disabled):hover {
    color: var(--color-danger);
    border-color: var(--color-danger);
  }

  @include focus-ring-visible;

  :slotted(svg) {
    width: 18px;
    height: 18px;
  }
}
</style>
