<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    readonly?: boolean
    disabled?: boolean
  }>(),
  { readonly: false, disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

function onChange(event: Event) {
  if (props.readonly) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}

function onClick(event: MouseEvent) {
  if (props.readonly) event.preventDefault()
}
</script>

<template>
  <label class="checkbox" :class="{ 'checkbox--readonly': readonly }">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      :aria-readonly="readonly || undefined"
      :tabindex="readonly ? -1 : undefined"
      @change="onChange"
      @click="onClick"
    >
    <span class="checkbox__box" aria-hidden="true">
      <IconCheck :size="14" />
    </span>
    <span v-if="label || $slots.default" class="checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox--readonly {
  cursor: default;
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
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: transparent;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}

.checkbox__input:checked + .checkbox__box {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
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
