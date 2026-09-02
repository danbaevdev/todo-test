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
      <BaseButton variant="primary" @click="clearError({ redirect: '/' })">
        На главную
      </BaseButton>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error {
  display: grid;
  justify-items: center;
  gap: space(3);
  padding: space(16) space(4);
  text-align: center;

  &__code {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-muted);
  }

  &__title { font-size: var(--font-size-xl); }

  &__hint { color: var(--color-text-muted); font-size: var(--font-size-sm); }
}
</style>
