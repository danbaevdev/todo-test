/**
 * Icon registry. Every glyph is drawn on the same 24×24 grid with a ~2px
 * margin and 2px stroke (Feather / Lucide proportions), so they render at a
 * consistent optical size. To add one: append its path `d` here.
 */
export const ICONS = {
  check: 'M20 6 9 17l-5-5',
  close: 'M18 6 6 18M6 6l12 12',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  undo: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5',
  redo: 'M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5',
  trash:
    'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
} satisfies Record<string, string>

export type IconName = keyof typeof ICONS
