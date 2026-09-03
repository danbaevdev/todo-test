<script setup lang="ts">
import {nextTick, onBeforeUnmount, ref, useId, useSlots, watch} from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    /** Plain-text convenience; a `#content` slot takes precedence. */
    content?: string
    /** Preferred side. Flips automatically when it would clip. */
    placement?: Placement
    /** Gap between trigger and tooltip, px. */
    offset?: number
    /** Delay before showing on hover, ms. */
    delay?: number
    disabled?: boolean
  }>(),
  {placement: 'top', offset: 8, delay: 120, disabled: false},
)

/** Minimum distance the tooltip keeps from the viewport edges. */
const VIEWPORT_MARGIN = 8

const slots = useSlots()
const id = useId()

const triggerEl = ref<HTMLElement | null>(null)
const tipEl = ref<HTMLElement | null>(null)
const open = ref(false)
const ready = ref(false)
const resolved = ref<Placement>(props.placement)
const coords = ref({top: 0, left: 0})

let showTimer: ReturnType<typeof setTimeout> | null = null

function hasContent(): boolean {
  return !!slots.content || !!props.content
}

/** Touch devices have no hover and can't read a tooltip — the control speaks for itself. */
function canHover(): boolean {
  return typeof window === 'undefined' || window.matchMedia('(hover: hover)').matches
}

function place() {
  const trigger = triggerEl.value
  const tip = tipEl.value
  if (!trigger || !tip) return

  const t = trigger.getBoundingClientRect()
  const w = tip.offsetWidth
  const h = tip.offsetHeight
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const off = props.offset

  let placement = props.placement
  if (placement === 'top' && t.top - h - off < VIEWPORT_MARGIN) placement = 'bottom'
  else if (placement === 'bottom' && t.bottom + h + off > vh - VIEWPORT_MARGIN) placement = 'top'
  else if (placement === 'left' && t.left - w - off < VIEWPORT_MARGIN) placement = 'right'
  else if (placement === 'right' && t.right + w + off > vw - VIEWPORT_MARGIN) placement = 'left'
  resolved.value = placement

  let top = 0
  let left = 0
  if (placement === 'top') {
    top = t.top - h - off
    left = t.left + t.width / 2 - w / 2
  } else if (placement === 'bottom') {
    top = t.bottom + off
    left = t.left + t.width / 2 - w / 2
  } else if (placement === 'left') {
    left = t.left - w - off
    top = t.top + t.height / 2 - h / 2
  } else {
    left = t.right + off
    top = t.top + t.height / 2 - h / 2
  }

  // Keep the whole tooltip on screen with a margin.
  left = Math.min(
    Math.max(left, VIEWPORT_MARGIN),
    Math.max(VIEWPORT_MARGIN, vw - w - VIEWPORT_MARGIN),
  )
  top = Math.min(
    Math.max(top, VIEWPORT_MARGIN),
    Math.max(VIEWPORT_MARGIN, vh - h - VIEWPORT_MARGIN),
  )

  coords.value = {top, left}
  ready.value = true
}

function show() {
  if (props.disabled || !hasContent() || open.value || !canHover()) return
  showTimer = setTimeout(() => {
    open.value = true
    nextTick(place)
  }, props.delay)
}

function hide() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  open.value = false
  ready.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}

function bindReposition(bind: boolean) {
  if (bind) {
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    document.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('scroll', place, true)
    window.removeEventListener('resize', place)
    document.removeEventListener('keydown', onKeydown)
  }
}

watch(open, bindReposition)

onBeforeUnmount(() => {
  hide()
  bindReposition(false)
})
</script>

<template>
  <span
    ref="triggerEl"
    class="tooltip-trigger"
    :aria-describedby="open ? id : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="open"
        :id="id"
        ref="tipEl"
        role="tooltip"
        class="tooltip"
        :class="`tooltip--${resolved}`"
        :style="{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          visibility: ready ? 'visible' : 'hidden',
        }"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-trigger {
  display: inline-flex;
}

.tooltip {
  position: fixed;
  z-index: var(--z-toast);
  max-width: min(280px, calc(100vw - var(--space-8)));
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  box-shadow: var(--shadow-md);
  pointer-events: none;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

.tooltip--top.tooltip-enter-from,
.tooltip--top.tooltip-leave-to {
  transform: translateY(3px);
}

.tooltip--bottom.tooltip-enter-from,
.tooltip--bottom.tooltip-leave-to {
  transform: translateY(-3px);
}

.tooltip--left.tooltip-enter-from,
.tooltip--left.tooltip-leave-to {
  transform: translateX(3px);
}

.tooltip--right.tooltip-enter-from,
.tooltip--right.tooltip-leave-to {
  transform: translateX(-3px);
}
</style>
