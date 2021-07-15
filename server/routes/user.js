import { Router } from 'express';
import { fetchUserByEmail, fetchAllUsers, deleteUser } from '../controller/user.js';

const router = Router();

router.post('/fetchbyemail', fetchUserByEmail);
router.get('/fetchall', fetchAllUsers);
router.post('/delete', deleteUser);

export default router;