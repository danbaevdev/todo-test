<template>
  <div class="shell">
    <header class="shell__header">
      <div class="container">
        <NuxtLink to="/" class="shell__brand">Заметки</NuxtLink>
      </div>
    </header>
    <main class="container shell__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shell__header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.shell__brand {
  display: inline-block;
  padding-block: var(--space-4);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

.shell__brand:hover {
  text-decoration: none;
}

.shell__main {
  flex: 1;
  padding-block: var(--space-6) var(--space-12);
}
</style>
