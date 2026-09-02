<template>
  <div class="empty">
    <p class="empty__title">Пока нет заметок</p>
    <p class="empty__hint">Создайте первую заметку, чтобы начать список задач.</p>
  </div>
</template>

<style scoped lang="scss">
.empty {
  display: grid;
  gap: space(1);
  padding: space(12) space(4);
  text-align: center;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);

  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
  }

  &__hint {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
}
</style>
