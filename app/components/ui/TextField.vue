<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { debounce } from '~/utils/debounce'

const props = withDefaults(
  defineProps<{
    modelValue: string
    /** Idle time before a `pause` event fires, ms. */
    pauseDelay?: number
    placeholder?: string
    ariaLabel?: string
    multiline?: boolean
    invalid?: boolean
  }>(),
  { pauseDelay: 400, multiline: false, invalid: false },
)

const emit = defineEmits<{
  'update:modelValue': [string]
  /** Continuous typing settled (idle) — a good point to seal history. */
  pause: []
  /** Field lost focus. */
  commit: []
  keydownEnter: [KeyboardEvent]
}>()

const emitPause = debounce(() => emit('pause'), props.pauseDelay)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value)
  emitPause()
}

function onBlur() {
  emitPause.cancel()
  emit('commit')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !props.multiline) {
    emit('keydownEnter', event)
  }
}

onBeforeUnmount(() => emitPause.cancel())
</script>

<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    class="field"
    :class="{ 'field--invalid': invalid }"
    :type="multiline ? undefined : 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    :aria-invalid="invalid || undefined"
    :rows="multiline ? 2 : undefined"
    @input="onInput"
    @blur="onBlur"
    @keydown="onKeydown"
  />
</template>

<style scoped>
/* Single-line inputs match Button height. */
.field {
  width: 100%;
  min-height: var(--control-height);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  transition: border-color var(--transition-fast), background-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.field::placeholder {
  color: var(--color-text-muted);
}

/* Light hover — skipped while focused so the focus state stays clean. */
.field:hover:not(:focus-visible) {
  border-color: color-mix(in srgb, var(--color-text) 25%, var(--color-border-strong));
  background: color-mix(in srgb, var(--color-text) 3%, var(--color-surface));
}

.field--invalid {
  border-color: var(--color-danger);
}

/* Invalid keeps its red border on hover, just adds a faint red wash. */
.field--invalid:hover:not(:focus-visible) {
  border-color: var(--color-danger);
  background: color-mix(in srgb, var(--color-danger) 6%, var(--color-surface));
}

/* Outline comes from the global :focus-visible rule; just tint the border. */
.field:focus-visible {
  border-color: var(--color-primary);
}

textarea.field {
  padding-block: var(--space-2);
  resize: vertical;
}
</style>
