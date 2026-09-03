interface NavigatorUAData {
  platform?: string
}

/** Best-effort macOS detection (navigator.platform is deprecated but still works). */
export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const uaData = (navigator as Navigator & {userAgentData?: NavigatorUAData}).userAgentData
  const raw = (uaData?.platform || navigator.platform || navigator.userAgent || '').toLowerCase()
  return raw.includes('mac')
}

export interface ShortcutParts {
  /** Base key, e.g. "Z". */
  key: string
  shift?: boolean
}

/**
 * Human-readable keyboard shortcut for the current platform.
 *   mac:  ⌘Z / ⇧⌘Z
 *   win:  Ctrl+Z / Ctrl+Shift+Z
 */
export function formatShortcut({key, shift}: ShortcutParts, mac = isMacOS()): string {
  if (mac) return `${shift ? '⇧' : ''}⌘${key}`
  return ['Ctrl', shift ? 'Shift' : null, key].filter(Boolean).join('+')
}

/** aria-keyshortcuts value covering both Control and Meta. */
export function ariaKeyshortcuts({key, shift}: ShortcutParts): string {
  const mods = shift ? '+Shift' : ''
  return `Control${mods}+${key} Meta${mods}+${key}`
}
