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
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped lang="scss">
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: space(2);
  cursor: pointer;

  &--readonly {
    cursor: default;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  &__box {
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

    svg { width: 14px; height: 14px; }
  }

  &__input:checked + &__box {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  // The real input is visually hidden, so mirror the focus outline onto the box.
  &__input:focus-visible + &__box {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &__label {
    font-size: var(--font-size-sm);
  }
}
</style>
