<template>
  <div class="shell">
    <header class="shell__header">
      <div class="shell__inner">
        <NuxtLink to="/" class="shell__brand">Заметки&nbsp;&amp;&nbsp;Todo</NuxtLink>
      </div>
    </header>
    <main class="shell__inner shell__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    position: sticky;
    top: 0;
    z-index: z('sticky');
  }

  &__inner {
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto;
    padding-inline: space(4);
  }

  &__brand {
    display: inline-block;
    padding-block: space(4);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
    color: var(--color-text);

    &:hover { text-decoration: none; }
  }

  &__main {
    flex: 1;
    padding-block: space(6) space(12);
  }
}
</style>
