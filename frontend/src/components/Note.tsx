import styles from '../styles/Note.module.css';
import styleUtils from '../styles/utils.module.css';
import { Card } from 'react-bootstrap';
import { Note as NoteModel } from '../models/notes';
import formatDate from '../utils/formatDate';
import { MdDelete } from 'react-icons/md';
interface INotesProps {
  note: NoteModel;
  className?: string;
  onDeleteNoteClicked: (note: NoteModel) => void;
  setNoteToEdit: (note: NoteModel) => void;
}

const Note = ({
  note,
  className,
  onDeleteNoteClicked,
  setNoteToEdit,
}: INotesProps) => {
  const { _id, title, text, createdAt, updatedAt } = note;

  let createdUpdatedDate: string;
  createdUpdatedDate =
    updatedAt < createdAt
      ? 'Created: ' + formatDate(createdAt)
      : 'Updated: ' + formatDate(updatedAt);

  return (
    <Card
      className={`${styles.noteCard} ${className}`}
      onClick={() => setNoteToEdit(note)}
    >
      <Card.Body className={styles.noteBody}>
        <Card.Title className={`${styleUtils.flexCenter}`}>
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteNoteClicked(note);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedDate}</Card.Footer>
    </Card>
  );
};

export default Note;
