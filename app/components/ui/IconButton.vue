<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Accessible name — the button has no visible text. */
    label: string
    disabled?: boolean
    variant?: 'default' | 'ghost' | 'danger'
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

<style scoped>
/* Same height as Button; a touch wider than tall. */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--control-height);
  width: calc(var(--control-height) + var(--space-2));
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.icon-button--default {
  border-color: var(--color-border-strong);
  background: var(--color-surface);
}

.icon-button:not(:disabled):hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.icon-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.icon-button--danger:not(:disabled):hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
</style>
