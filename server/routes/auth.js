import { Router } from 'express';
import { Login, GoogleLogin, Register } from '../controller/auth.js';

const router = Router();


router.post('/login', Login);
router.post('/googlelogin', GoogleLogin);
router.post('/register', Register);

export default router;