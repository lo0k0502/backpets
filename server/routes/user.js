import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { 
    fetchUserByEmail, 
    fetchAllUsers, 
    updateUserPassword,
    deleteUser, 
    updateUserProfile 
} from '../controller/user.js';

const router = Router();

router.post('/fetchbyemail', fetchUserByEmail);
router.get('/fetchall', fetchAllUsers);
router.post('/updatepassword', auth, updateUserPassword);
router.post('/updateprofile', auth, updateUserProfile);
router.post('/delete', deleteUser);

export default router;