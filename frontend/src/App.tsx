import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import styles from './styles/NotePage.module.css';
import styleUtils from './styles/utils.module.css';
import { useCallback, useEffect, useState } from 'react';
import { Note as NoteModel } from './models/notes';
import Note from './components/Note';
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { Col, Container, Row, Button, Spinner } from 'react-bootstrap';
import * as NoteApi from './network/notes_api';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [notesLoading, setNotesLoading] = useState<boolean>(true);
  const [showNoteErrorLoading, setShowNoteErrorLoading] =
    useState<boolean>(false);

  const onDeleteNoteClicked = useCallback(
    async (deleteNote: NoteModel) => {
      try {
        await NoteApi.deleteNote(deleteNote._id);
        const newNotes = notes.filter((note) => note._id !== deleteNote._id);
        setNotes(newNotes);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    },
    [notes]
  );

  type ResponseData = {
    success: boolean;
    data?: NoteModel[];
    message?: string;
  };

  useEffect(() => {
    const getNotes = async () => {
      try {
        const data = await NoteApi.fetchNotes();
        setNotes(data);
      } catch (error) {
        console.log(error);
        setShowNoteErrorLoading(true);
      } finally {
        setNotesLoading(false);
      }
    };
    getNotes();
  }, []);

  return (
    <Container>
      <Button
        className={`mb-4 ${styleUtils.blockCenter}`}
        onClick={() => setShowAddNoteDialog(!showAddNoteDialog)}
      >
        Add New Note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNoteErrorLoading && <p>An error occurred while loading the note</p>}
      {!notesLoading && !showNoteErrorLoading && notes.length === 0 ? (
        <p>You don't have any notes</p>
      ) : (
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
          {notes.map((note) => (
            <Col key={note._id}>
              <Note
                note={note}
                className={styles.note}
                onDeleteNoteClicked={onDeleteNoteClicked}
                setNoteToEdit={setNoteToEdit}
              />
            </Col>
          ))}
        </Row>
      )}
      {showAddNoteDialog && (
        <AddEditNoteDialog
          handleClose={() => {
            setShowAddNoteDialog(false);
          }}
          handleNoteSaved={(newNote: NoteModel) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          handleClose={() => {
            setNoteToEdit(null);
          }}
          handleNoteSaved={(newNote: NoteModel) => {
            setNotes(
              notes.map((note) =>
                note._id === noteToEdit._id ? newNote : note
              )
            );
            setShowAddNoteDialog(false);
            setNoteToEdit(null);
          }}
        />
      )}
    </Container>
  );
}

export default App;
