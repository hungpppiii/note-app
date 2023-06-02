import { Note } from '../models/notes';

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response.json();
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.message;
    throw new Error(errorMessage);
  }
}

export async function fetchNotes(): Promise<Note[]> {
  const responseData = await fetchData('/api/notes', { method: 'GET' });
  return responseData.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(data: NoteInput): Promise<Note> {
  const responseData = await fetchData('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return responseData.data;
}

export async function updateNote(noteId: string, data: NoteInput): Promise<Note> {
  const responseData = await fetchData(`/api/notes/${noteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return responseData.data;
}

export async function deleteNote(noteId: string) {
  await fetchData(`/api/notes/${noteId}`, {
    method: 'DELETE',
  });
}
