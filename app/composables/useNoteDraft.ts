import { onBeforeUnmount, watch, type Ref } from 'vue'
import { debounce } from '~/utils/debounce'
import { createNotesStorage } from '~/utils/storage'
import { SCHEMA_VERSION, type Note, type PersistedDraft } from '~/types/note'

const DRAFT_DELAY = 600

/**
 * Persists an in-progress note edit so an accidental reload can be recovered.
 * The draft is written debounced while the edit is dirty and cleared on
 * save / cancel.
 */
export function useNoteDraft(noteId: string, note: Ref<Note>, isDirty: Ref<boolean>) {
  const storage = createNotesStorage()

  const existing: PersistedDraft | null = storage.readDraft(noteId)

  const write = debounce(() => {
    if (!isDirty.value) return
    storage.writeDraft({
      schemaVersion: SCHEMA_VERSION,
      noteId,
      note: JSON.parse(JSON.stringify(note.value)),
      savedAt: Date.now(),
    })
  }, DRAFT_DELAY)

  const stop = watch(
    () => [note.value, isDirty.value] as const,
    () => {
      if (isDirty.value) write()
      else {
        write.cancel()
        storage.clearDraft(noteId)
      }
    },
    { deep: true },
  )

  function flush() {
    if (isDirty.value) write.flush()
  }

  function clear() {
    write.cancel()
    storage.clearDraft(noteId)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flush)
  }

  onBeforeUnmount(() => {
    stop()
    if (typeof window !== 'undefined') window.removeEventListener('beforeunload', flush)
  })

  return { existingDraft: existing, clear, flush }
}
