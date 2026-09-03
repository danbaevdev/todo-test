<template>
  <div class="notice" role="status">
    <p class="notice__text">
      Эта заметка была удалена в другой вкладке. Вы можете продолжить редактирование — при
      сохранении она будет создана заново.
    </p>
  </div>
</template>

<style scoped>
.notice {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-warning) 12%, var(--color-surface));
}

.notice__text {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}
</style>
