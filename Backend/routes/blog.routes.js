import express from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import {blogComment, createPost, deleteBlog, deleteComment, getAllPost, getMyBlogs, singleBlog} from '../controllers/blog.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/post', verifyJWT,  upload.single('image'), createPost);

router.get('/', getAllPost);
router.get('/my-blog', verifyJWT, getMyBlogs );

router.delete('/:id', verifyJWT,  deleteBlog);
router.get('/single-page/:id', singleBlog);


router.post('/comment', verifyJWT, blogComment);
router.delete("/comment/:commentId", verifyJWT, deleteComment)


export default router;