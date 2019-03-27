import express from 'express'
import Admin from '../../controller/back/login'
import Tag from '../../controller/back/tag'
import Article from '../../controller/back/article'

const router = express.Router()

router.post('/login', Admin.login);

router.get('/tag/search', Tag.search);
router.post('/tag/add', Tag.add);
router.post('/tag/delete', Tag.delete);
router.post('/tag/edit', Tag.edit);

router.post('/article/publish', Article.publish);
router.get('/article/search', Article.search);
router.post('/article/title/edit', Article.editTitle);
router.post('/article/delete', Article.delete);

export default router