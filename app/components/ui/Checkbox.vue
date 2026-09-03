<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
  }>(),
  {disabled: false},
)

const emit = defineEmits<{'update:modelValue': [boolean]}>()

function onChange(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}

/** Native checkboxes toggle on Space only — accept Enter too. */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !props.disabled) {
    event.preventDefault()
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <label class="checkbox" :class="{'checkbox--disabled': disabled}">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
      @keydown="onKeydown"
    />
    <span class="checkbox__box" aria-hidden="true">
      <Icon name="check" />
    </span>
    <span v-if="label || $slots.default" class="checkbox__label"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox--disabled {
  cursor: not-allowed;
}

.checkbox--disabled .checkbox__box {
  opacity: 0.5;
  background: var(--color-surface-alt);
}

.checkbox--disabled .checkbox__label {
  color: var(--color-text-muted);
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  flex-shrink: 0;
  font-size: var(--icon-size-xs); /* sizes the 1em check <Icon> */
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: transparent;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.checkbox__input:checked + .checkbox__box {
  background: var(--color-primary-fill);
  border-color: var(--color-primary-fill);
  color: var(--color-on-fill);
}

/* The real input is visually hidden, so mirror the focus outline onto the box. */
.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.checkbox__label {
  font-size: var(--font-size-sm);
}
</style>
