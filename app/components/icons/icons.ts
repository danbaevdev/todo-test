/**
 * Icon registry. Every glyph is drawn on the same 24×24 grid with a ~2px
 * margin and 2px stroke (Feather / Lucide proportions), so they render at a
 * consistent optical size. To add one: append its path `d` here.
 */
export const ICONS = {
  check: 'M20 6 9 17l-5-5',
  close: 'M19 5 5 19M5 5l14 14',
  undo: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5',
  redo: 'M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5',
  trash:
    'M3 6h18M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6M6 6l.9 13.1A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 6M10 11v5M14 11v5',
  // macOS ⌘ key
  command: 'M7 9a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h10a2 2 0 1 1-2 2V7a2 2 0 1 1 2 2H7',
  // ⇧ shift key
  shift: 'M12 4l7 7h-4v6H9v-6H5z',
} satisfies Record<string, string>

export type IconName = keyof typeof ICONS
