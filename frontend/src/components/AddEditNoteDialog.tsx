import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { NoteInput } from '../network/notes_api';
import * as NoteApi from '../network/notes_api';
import { Note as NoteModel } from '../models/notes';
import TextInputField from './form/TextInputField';

interface AddNoteDialogProps {
  noteToEdit?: NoteModel;
  handleClose: () => void;
  handleNoteSaved: (newNote: NoteModel) => void;
}

const AddEditNoteDialog = ({
  noteToEdit,
  handleClose,
  handleNoteSaved,
}: AddNoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || '',
      text: noteToEdit?.text || '',
    },
  });

  const onSubmit = async (input: NoteInput) => {
    try {
      let newNote: NoteModel;
      if (noteToEdit) {
        newNote = await NoteApi.updateNote(noteToEdit._id, input);
      } else {
        newNote = await NoteApi.createNote(input);
      }
      handleNoteSaved(newNote);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? 'Update Note' : 'Add New Note'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name={'title'}
            label={'Title'}
            register={register}
            registerOptions={{
              required: 'This field cannot be left blank',
            }}
            error={errors.title}
            type="text"
            placeholder="Enter title name"
          />
          <TextInputField
            name={'text'}
            label={'Text'}
            register={register}
            error={errors.text}
            type="text"
            as={'textarea'}
            rows={3}
            placeholder="Enter text name"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="addEditNoteForm"
          disabled={isSubmitting}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
