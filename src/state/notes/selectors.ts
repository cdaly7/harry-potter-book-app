import { RootState } from '../../store';

// Stable empty array to avoid creating new references
const EMPTY_NOTES: never[] = [];

/**
 * Selector to get notes for a specific book
 * Returns a stable empty array reference when no notes exist
 */
export const selectNotesByBookKey = (bookKey: string) => (state: RootState) => 
  state.notes.notesByBook[bookKey] ?? EMPTY_NOTES;
