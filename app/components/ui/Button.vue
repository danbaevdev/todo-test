<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    /** Fill style. */
    variant?: 'solid' | 'outline' | 'ghost'
    /** Semantic color. */
    color?: 'neutral' | 'primary' | 'danger'
    /** Control size. */
    size?: 'sm' | 'md' | 'lg'
    /** Icon-only button: square-ish, needs `label` for its accessible name. */
    icon?: boolean
    /** Accessible name — required when `icon`. */
    label?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    /** When set, renders as a router link with button styling. */
    to?: string
  }>(),
  { variant: 'solid', color: 'neutral', size: 'md', icon: false, type: 'button', disabled: false },
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
    :class="['btn', `btn--${variant}`, `btn--${color}`, `btn--${size}`, { 'btn--icon': icon }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  --icon-h: var(--control-height);
  --icon-glyph: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-decoration: none;
  transition: background-color var(--transition-fast), border-color var(--transition-fast),
    color var(--transition-fast), transform var(--transition-fast);
}

.btn:hover {
  text-decoration: none;
}

/* Press feedback — every variant nudges down a hair. */
.btn:not(:disabled):active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* --- Size --------------------------------------------------------------- */
.btn--sm {
  --icon-h: var(--control-height-sm);
  --icon-glyph: 16px;
  min-height: var(--control-height-sm);
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
}
.btn--md {
  min-height: var(--control-height);
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-sm);
}
.btn--lg {
  --icon-h: var(--control-height-lg);
  --icon-glyph: 20px;
  min-height: var(--control-height-lg);
  padding: var(--space-2) var(--space-5);
  font-size: var(--font-size-md);
}

/* Icon-only: square-ish, a touch wider than tall; never shrinks in a flex row. */
.btn--icon {
  gap: 0;
  min-height: 0;
  height: var(--icon-h);
  width: calc(var(--icon-h) + var(--space-2));
  padding: 0;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.btn--icon :slotted(svg) {
  width: var(--icon-glyph);
  height: var(--icon-glyph);
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
.btn--solid:not(:disabled):active {
  background: color-mix(in srgb, var(--c-solid-bg-hover) 88%, #000);
}

.btn--outline {
  background: transparent;
  color: var(--c-main);
  border-color: var(--c-border);
}
.btn--outline:not(:disabled):hover {
  background: color-mix(in srgb, var(--c-main) 10%, transparent);
}
.btn--outline:not(:disabled):active {
  background: color-mix(in srgb, var(--c-main) 18%, transparent);
}

.btn--ghost {
  background: transparent;
  color: var(--c-main);
}
.btn--ghost:not(:disabled):hover {
  background: color-mix(in srgb, var(--c-main) 10%, transparent);
}
.btn--ghost:not(:disabled):active {
  background: color-mix(in srgb, var(--c-main) 18%, transparent);
}
</style>
