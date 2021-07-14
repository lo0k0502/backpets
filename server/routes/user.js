import { Router } from 'express';
import { fetchAllUsers, deleteUser } from '../controller/user.js';

const router = Router();

router.get('/fetchall', fetchAllUsers);
router.post('/delete', deleteUser);

export default router;