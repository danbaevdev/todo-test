<template>
  <div class="empty">
    <p class="empty__title">Пока нет заметок</p>
    <p class="empty__hint">Создайте первую заметку, чтобы начать список задач.</p>
  </div>
</template>

<style scoped>
.empty {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-12) var(--space-4);
  text-align: center;
}

.empty__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.empty__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
