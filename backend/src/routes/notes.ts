import { Router } from 'express';
import * as NoteController from '../controllers/notes';

const router = Router();

router.get('/:id', NoteController.getNote);
router.get('/', NoteController.getNotes);
router.post('/', NoteController.createNote);
router.patch('/:id', NoteController.updateNode);
router.delete('/:id', NoteController.deleteNote);

export default router;
