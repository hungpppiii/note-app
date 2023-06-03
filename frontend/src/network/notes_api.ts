import { Note } from '../models/notes';
import { fetchData } from './fetchData';

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData('/api/notes');
  const responseData = await response.json();
  return responseData.data;
}

export async function fetchNote(noteId: string): Promise<Note> {
  const response = await fetchData(`/api/notes/${noteId}`);
  const responseData = await response.json();
  return responseData.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(data: NoteInput): Promise<Note> {
  const response = await fetchData('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData.data;
}

export async function updateNote(
  noteId: string,
  data: NoteInput
): Promise<Note> {
  const response = await fetchData(`/api/notes/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData.data;
}

export async function deleteNote(noteId: string) {
  await fetchData(`/api/notes/${noteId}`, {
    method: 'DELETE',
  });
}
