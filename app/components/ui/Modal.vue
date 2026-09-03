<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useFocusTrap } from '~/composables/useFocusTrap'

const props = withDefaults(
  defineProps<{
    title: string
    /** Close when the backdrop is clicked. */
    dismissible?: boolean
  }>(),
  { dismissible: true },
)

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)
const titleId = useId()

useFocusTrap(dialog)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
  }
}

function onBackdrop() {
  if (props.dismissible) emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown, true)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown, true)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="modal" @mousedown.self="onBackdrop">
      <div
        ref="dialog"
        class="modal__dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header class="modal__header">
          <h2 :id="titleId" class="modal__title">{{ title }}</h2>
          <button type="button" class="modal__close" aria-label="Закрыть" @click="emit('close')">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </header>
        <div class="modal__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--color-overlay);
}

.modal__dialog {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--space-8));
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-4) var(--space-3);
}

.modal__title {
  font-size: var(--font-size-lg);
}

.modal__close {
  display: inline-flex;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
}

.modal__close svg {
  width: 18px;
  height: 18px;
}

.modal__close:hover {
  color: var(--color-text);
}

.modal__body {
  padding: 0 var(--space-4) var(--space-4);
  overflow-y: auto;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4) var(--space-4);
}
</style>
