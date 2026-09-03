<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'outline' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
    /** When set, the button renders as a router link with button styling. */
    to?: string
  }>(),
  { variant: 'ghost', type: 'button', disabled: false },
)
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    :class="['btn', `btn--${variant}`]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
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
  text-decoration: none;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}

.btn:hover {
  text-decoration: none;
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
  background: transparent;
  color: var(--color-text);
}
.btn--ghost:not(:disabled):hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.btn--outline {
  background: transparent;
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
.btn--outline:not(:disabled):hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.btn--danger {
  background: var(--color-danger);
  color: var(--color-text-inverse);
}
.btn--danger:not(:disabled):hover {
  background: var(--color-danger-hover);
}
</style>
