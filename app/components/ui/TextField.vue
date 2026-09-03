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

<style scoped lang="scss">
.field {
  width: 100%;
  padding: space(2) space(3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  resize: vertical;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

  &::placeholder { color: var(--color-text-muted); }

  &:focus-visible {
    @include focus-ring;
    border-color: var(--color-primary);
  }

  &--invalid {
    border-color: var(--color-danger);
  }
}
</style>
