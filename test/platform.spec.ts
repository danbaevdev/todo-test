import {describe, expect, it} from 'vitest'
import {ariaKeyshortcuts, formatShortcut} from '~/utils/platform'

describe('formatShortcut', () => {
  it('renders macOS symbols', () => {
    expect(formatShortcut({key: 'Z'}, true)).toBe('⌘Z')
    expect(formatShortcut({key: 'Z', shift: true}, true)).toBe('⇧⌘Z')
  })

  it('renders Windows / Linux words', () => {
    expect(formatShortcut({key: 'Z'}, false)).toBe('Ctrl+Z')
    expect(formatShortcut({key: 'Z', shift: true}, false)).toBe('Ctrl+Shift+Z')
  })
})

describe('ariaKeyshortcuts', () => {
  it('covers both Control and Meta', () => {
    expect(ariaKeyshortcuts({key: 'Z'})).toBe('Control+Z Meta+Z')
    expect(ariaKeyshortcuts({key: 'Z', shift: true})).toBe('Control+Shift+Z Meta+Shift+Z')
  })
})
