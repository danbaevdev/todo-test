<script setup lang="ts">
import { computed } from 'vue'
import { noteTitle } from '~/utils/note'
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{ delete: [] }>()

const doneCount = computed(() => props.note.todos.filter((t) => t.done).length)
const title = computed(() => noteTitle(props.note))
</script>

<template>
  <article class="note-card">
    <div class="note-card__head">
      <h2 class="note-card__title line-clamp-2">{{ title }}</h2>
      <span v-if="note.todos.length" class="note-card__count">
        {{ doneCount }} / {{ note.todos.length }}
      </span>
    </div>

    <TodoPreviewList :todos="note.todos" :max="3" />

    <div class="note-card__actions">
      <Button
        :to="`/notes/${note.id}`"
        :aria-label="`Редактировать заметку «${title}»`"
        variant="outline"
        class="note-card__link"
      >
        Редактировать
      </Button>
      <Button color="danger" class="note-card__delete" @click="emit('delete')">Удалить</Button>
    </div>
  </article>
</template>

<style scoped>
.note-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.note-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-md);
}

/* Keyboard focus on the edit link shows the ring on the whole card. */
.note-card:has(.note-card__link:focus-visible) {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.note-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.note-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.note-card__count {
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.note-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  /* Pin to the bottom so action rows line up across cards of unequal height. */
  margin-top: auto;
  padding-top: var(--space-1);
}

/* The edit link stretches over the whole card — click anywhere to open it. */
.note-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
}
.note-card__link:focus-visible {
  outline: none; /* the card wears the ring instead */
}

/* Hovering the card previews the link's hover state too. */
.note-card:hover .note-card__link {
  background: color-mix(in srgb, var(--color-text) 10%, transparent);
}

/* Delete stays clickable above the stretched link. */
.note-card__delete {
  position: relative;
  z-index: 1;
}
</style>
