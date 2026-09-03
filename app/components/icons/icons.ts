/**
 * Icon registry. To add an icon: drop one entry here (24px-ish stroke icon,
 * single `d`, `currentColor`) — no new component needed.
 */
export interface IconDef {
  viewBox: string
  d: string
  /** Stroke width in the icon's own viewBox units. Default 1.6. */
  strokeWidth?: number
}

export const ICONS = {
  undo: { viewBox: '0 0 20 20', d: 'M8 5L3 9l5 4M3 9h9a5 5 0 010 10' },
  redo: { viewBox: '0 0 20 20', d: 'M12 5l5 4-5 4M17 9H8a5 5 0 000 10' },
  trash: { viewBox: '0 0 20 20', d: 'M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10' },
  close: { viewBox: '0 0 20 20', d: 'M5 5l10 10M15 5L5 15', strokeWidth: 2 },
  check: { viewBox: '0 0 16 16', d: 'M3.5 8.5l3 3 6-7', strokeWidth: 2 },
  'arrow-left': { viewBox: '0 0 20 20', d: 'M11 5l-5 5 5 5M6 10h9' },
} satisfies Record<string, IconDef>

export type IconName = keyof typeof ICONS
