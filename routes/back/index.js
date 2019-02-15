import express from 'express'
import Admin from '../../controller/back/login'
import Tag from '../../controller/back/tag'

const router = express.Router()

router.post('/login', Admin.login);

router.get('/tag/search', Tag.search);
router.post('/tag/add', Tag.add);
router.post('/tag/delete', Tag.delete);
router.post('/tag/edit', Tag.edit);

export default router