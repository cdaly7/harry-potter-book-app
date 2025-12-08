import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote, deleteNote } from '../../state/notes/slice';
import { selectNotesByBookKey } from '../../state/notes/selectors';
import type { AppDispatch } from '../../store';
import './Notes.css';

interface NotesProps {
  bookKey: string;
}

function Notes({ bookKey }: NotesProps) {
  const [noteText, setNoteText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const selectNotes = useMemo(() => selectNotesByBookKey(bookKey), [bookKey]);
  const notes = useSelector(selectNotes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) {
      dispatch(addNote({ bookKey, text: noteText.trim() }));
      setNoteText('');
    }
  };

  const handleDelete = (noteIndex: number) => {
    dispatch(deleteNote({ bookKey, noteIndex }));
  };

  return (
    <div className="notes-container">
      <h2>My Notes</h2>
      
      <form onSubmit={handleSubmit} className="note-form">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write your note here..."
          rows={4}
          className="note-input"
        />
        <button type="submit" className="add-note-button">
          Add Note
        </button>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-notes">No notes yet. Add your first note above!</p>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="note-item">
              <div className="note-content">
                <p className="note-text">{note.text}</p>
                <p className="note-date">
                  {new Date(note.dateCreated).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="delete-note-button"
                aria-label="Delete note"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
