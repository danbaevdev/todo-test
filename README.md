# Заметки & Todo

SPA-приложение для заметок со списками задач. Nuxt 4, Composition API, TypeScript strict.
Без UI-библиотек и без препроцессоров — вёрстка, модальные окна и дизайн-система
собственные, на чистом CSS с custom properties.

**Демо:** https://danbaevdev.github.io/todo-test/ — деплой автоматический на каждый пуш
в `main` (см. [Деплой](#деплой-github-pages)).

## Возможности

- **Главная** — список заметок с сокращённым превью Todo, создание / переход к редактированию / удаление (с подтверждением).
- **Редактор** — правка названия и пунктов Todo (добавить / удалить / изменить текст / отметить), сохранение, отмена (с подтверждением), удаление.
- **История изменений** — ручной undo/redo (`Ctrl+Z` / `Shift+Ctrl+Z`, глобально на странице редактирования):
  - непрерывный ввод в одно поле — одна запись (фиксация по blur / паузе);
  - чекбокс, добавление и удаление пункта — атомарные записи;
  - новое действие после undo очищает redo-ветку;
  - лимит 50 шагов, хранятся диффы операций, а не копии заметки;
  - история живёт в рамках сессии: «Сохранить» и «Отменить редактирование» её сбрасывают.
- **Хранилище** — ручная синхронизация с `localStorage` (debounce, флаш по `visibilitychange` / `beforeunload`), версия схемы в данных, миграции.
- **Черновик** — незасохранённое редактирование переживает случайную перезагрузку: при возврате предлагается восстановить.
- **Edge-cases** — прямой переход по URL несуществующей заметки (404), пустое название / пустой пункт, удаление открытой заметки из другой вкладки (приложение не ломается, показывается баннер).
- **Доступность** — модалки с focus-trap, закрытием по `Escape`, возвратом фокуса; полная работа с клавиатуры; без нативных алертов.

## Архитектура

| Слой | Файл |
|---|---|
| Типы и версия схемы | `app/types/note.ts` |
| Хранилище (localStorage, миграции, черновик) | `app/utils/storage.ts` |
| Менеджер состояния (Pinia) | `app/stores/notes.ts` |
| История изменений | `app/composables/useEditHistory.ts` |
| Глобальные Ctrl+Z / Shift+Ctrl+Z | `app/composables/useUndoRedoShortcuts.ts` |
| Автосохранение черновика | `app/composables/useNoteDraft.ts` |
| Focus-trap | `app/composables/useFocusTrap.ts` |
| Дизайн-токены (CSS custom properties, светлая/тёмная тема) + `.container` | `app/assets/styles/tokens.css`, `base.css` |
| UI-примитивы | `app/components/ui/` |
| Доменные компоненты | `app/components/notes/` |

**Undo без хранения 50 копий:** история — стек типизированных операций (`set-title`, `toggle-todo`,
`edit-todo-text`, `add-todo`, `remove-todo`), каждая знает, как примениться и как откатиться.
Текстовый ввод коалесится в открытую запись до `seal()` (blur / пауза).

**Конфликт Ctrl+Z с полями:** пока фокус в текстовом поле, работает нативный undo браузера;
глобальный перехват — только когда фокус вне полей. Правки полей всё равно попадают в историю
через фиксацию по blur / паузе.

## Разработка

```bash
npm install
npm run dev            # http://localhost:3000
npm run test           # unit-тесты (Vitest): история изменений, стор, хранилище
npm run typecheck      # vue-tsc, strict
npm run build          # продакшн-сборка в .output

npm run lint           # ESLint (@nuxt/eslint, flat config)
npm run lint:style     # Stylelint (CSS + <style> в .vue)
npm run format         # Prettier — форматирование всего
npm run format:check   # Prettier — проверка без записи
```

Стиль: одинарные кавычки, без `;`, без пробелов в `{}`, `arrow` без скобок для одного
аргумента (`.prettierrc.json`).

## Docker

```bash
docker-compose up --build
```

Приложение будет доступно на `http://localhost:3000`.

## Деплой (GitHub Pages)

**Автоматически на каждый пуш в `main`** (и вручную через `workflow_dispatch`).
Workflow `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run lint` + `npm run lint:style` + `npm run test`
3. `nuxt generate` с `NUXT_APP_BASE_URL=/todo-test/`
4. `touch .output/public/.nojekyll` (иначе Jekyll режет папку `_nuxt/`)
5. публикация `.output/public` на Pages

Pages уже включён (Source: GitHub Actions). Deep-ссылки работают — `nuxt generate`
кладёт `404.html` = SPA-оболочку, GH Pages отдаёт её на неизвестных путях.

→ https://danbaevdev.github.io/todo-test/
