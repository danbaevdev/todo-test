<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <div class="error">
      <p class="error__code">{{ error.statusCode }}</p>
      <h1 class="error__title">
        {{ error.statusCode === 404 ? 'Заметка не найдена' : 'Что-то пошло не так' }}
      </h1>
      <p class="error__hint">{{ error.statusMessage }}</p>
      <Button variant="primary" @click="clearError({ redirect: '/' })">
        На главную
      </Button>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-16) var(--space-4);
  text-align: center;
}

.error__code {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.error__title {
  font-size: var(--font-size-xl);
}

.error__hint {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
