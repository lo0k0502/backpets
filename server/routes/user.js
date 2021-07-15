import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { fetchUserByEmail, fetchAllUsers, deleteUser, updateUser } from '../controller/user.js';

const router = Router();

router.post('/fetchbyemail', fetchUserByEmail);
router.get('/fetchall', fetchAllUsers);
router.post('/update', auth, updateUser);
router.post('/delete', deleteUser);

export default router;