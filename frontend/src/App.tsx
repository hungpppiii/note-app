import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/notes';
import Note from './components/Note';
import { Container, Row } from 'react-bootstrap';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  type ResponseData = {
    success: boolean;
    data?: NoteModel[];
    message?: string;
  };

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await fetch('/api/notes', { method: 'GET' });
        console.log('check');
        const jsonData: ResponseData = await response.json();
        jsonData.success && jsonData.data && setNotes(jsonData.data);
        if (!jsonData.success) {
          console.log(jsonData.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNotes();
  }, []);

  console.log(notes);

  return (
    <Container>
      <Row xs={1} md={2} xl={3}>
        {notes.map((note) => (
          <Note note={note} />
        ))}
      </Row>
    </Container>
  );
}

export default App;
