<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    /** Fill style. */
    variant?: 'solid' | 'outline' | 'ghost'
    /** Semantic color. */
    color?: 'neutral' | 'primary' | 'danger'
    /** Icon-only button: square-ish, needs `label` for its accessible name. */
    icon?: boolean
    /** Accessible name — required when `icon`. */
    label?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    /** When set, renders as a router link with button styling. */
    to?: string
  }>(),
  { variant: 'solid', color: 'neutral', icon: false, type: 'button', disabled: false },
)

const isLink = computed(() => !!props.to && !props.disabled)
</script>

<template>
  <component
    :is="isLink ? NuxtLink : 'button'"
    :to="isLink ? to : undefined"
    :type="isLink ? undefined : type"
    :disabled="isLink ? undefined : disabled"
    :aria-label="icon ? label : undefined"
    :title="icon ? label : undefined"
    :class="['btn', `btn--${variant}`, `btn--${color}`, { 'btn--icon': icon }]"
  >
    <slot />
  </component>
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

/* Icon-only: same height as a text button, a touch wider than tall. */
.btn--icon {
  gap: 0;
  min-height: 0;
  height: var(--control-height);
  width: calc(var(--control-height) + var(--space-2));
  padding: 0;
  border-radius: var(--radius-sm);
}

/* --- Color: exposes role tokens the variants consume ---------------------- */
.btn--neutral {
  --c-main: var(--color-text);
  --c-border: var(--color-border-strong);
  --c-solid-bg: var(--color-surface-alt);
  --c-solid-fg: var(--color-text);
  --c-solid-bg-hover: var(--color-border);
}
.btn--primary {
  --c-main: var(--color-primary);
  --c-border: var(--color-primary);
  --c-solid-bg: var(--color-primary);
  --c-solid-fg: var(--color-text-inverse);
  --c-solid-bg-hover: var(--color-primary-hover);
}
.btn--danger {
  --c-main: var(--color-danger);
  --c-border: var(--color-danger);
  --c-solid-bg: var(--color-danger);
  --c-solid-fg: var(--color-text-inverse);
  --c-solid-bg-hover: var(--color-danger-hover);
}

/* --- Variant ------------------------------------------------------------- */
.btn--solid {
  background: var(--c-solid-bg);
  color: var(--c-solid-fg);
}
.btn--solid:not(:disabled):hover {
  background: var(--c-solid-bg-hover);
}

.btn--outline {
  background: transparent;
  color: var(--c-main);
  border-color: var(--c-border);
}
.btn--outline:not(:disabled):hover {
  background: color-mix(in srgb, var(--c-main) 10%, transparent);
}

.btn--ghost {
  background: transparent;
  color: var(--c-main);
}
.btn--ghost:not(:disabled):hover {
  background: color-mix(in srgb, var(--c-main) 10%, transparent);
}
</style>
