import { Router } from 'express';
import { Login, GoogleLogin, Register, Logout, RefreshToken } from '../controller/auth.js';

const router = Router();


router.post('/login', Login);
router.post('/googlelogin', GoogleLogin);
router.post('/register', Register);
router.post('/logout', Logout);
router.post('/refreshtoken', RefreshToken);

export default router;