<script setup lang="ts">
import {computed, onBeforeUnmount, ref} from 'vue'
import {debounce} from '~/utils/debounce'

defineOptions({inheritAttrs: false})

const props = withDefaults(
  defineProps<{
    modelValue: string
    /** Idle time before a `pause` event fires, ms. */
    pauseDelay?: number
    placeholder?: string
    ariaLabel?: string
    multiline?: boolean
    invalid?: boolean
    /** Show a × button to wipe the value (single-line only). */
    clearable?: boolean
  }>(),
  {pauseDelay: 400, multiline: false, invalid: false, clearable: false},
)

const emit = defineEmits<{
  'update:modelValue': [string]
  /** Continuous typing settled (idle) — a good point to seal history. */
  pause: []
  /** Field lost focus. */
  commit: []
  keydownEnter: [KeyboardEvent]
}>()

const control = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const emitPause = debounce(() => emit('pause'), props.pauseDelay)

const showClear = computed(() => props.clearable && !props.multiline && props.modelValue.length > 0)

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

function clear() {
  emit('commit') // seal whatever is being typed
  emit('update:modelValue', '') // the wipe is its own undo step
  emit('commit')
  control.value?.focus()
}

onBeforeUnmount(() => emitPause.cancel())
</script>

<template>
  <div class="field-wrap">
    <component
      :is="multiline ? 'textarea' : 'input'"
      ref="control"
      v-bind="$attrs"
      class="field"
      :class="{'field--invalid': invalid, 'field--has-clear': showClear}"
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
    <Button
      v-if="showClear"
      icon
      variant="plain"
      size="xs"
      no-title
      label="Очистить"
      class="field__clear"
      @click="clear"
    >
      <Icon name="close" />
    </Button>
  </div>
</template>

<style scoped>
.field-wrap {
  position: relative;
  width: 100%;
}

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
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.field--has-clear {
  padding-right: calc(var(--icon-size-xs) + var(--space-2) * 2);
}

/* iOS Safari auto-zooms the viewport when a focused field's font is < 16px.
   Bump to 16px on touch devices — keeps pinch-zoom, kills the jump. */
@media (pointer: coarse) {
  .field {
    font-size: var(--font-size-md);
  }
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

.field__clear {
  position: absolute;
  top: 50%;
  right: var(--space-2);
  transform: translateY(-50%);
}

textarea.field {
  padding-block: var(--space-2);
  resize: vertical;
}
</style>
