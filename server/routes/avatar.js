import { Router } from 'express';

import uploadimg from '../middleware/uploadimg.js';

import { upload, get, del } from '../controller/img.js';

const router = Router();

router.post('/upload', uploadimg, upload);
router.get('/:filename', get);
router.delete('/:filename', del);

export default router;