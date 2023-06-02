import { Router } from 'express';
import * as UserController from '../controllers/users';

const router = Router();

router.get('/', UserController.getAuthenticatedUser);
router.post('/logout', UserController.logout);
router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);

export default router;
