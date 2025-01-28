import express from 'express';
import authenticate from '../middleware/authmiddleware.js';
import { 
    CreatePost, 
    GetAllPosts, 
    GetPostById, 
    UpdatePost, 
    DeletePost } from '../controllers/PostController.js';
import upload from '../middleware/uploud.js';

const router = express.Router();

router.route('/create')
    .post(authenticate, upload.single('image'), CreatePost);

router.route('/')
    .get(authenticate, GetAllPosts);

router.route('/:id')
    .get(authenticate, GetPostById)
    .put(authenticate, upload.single('image'), UpdatePost)
    .delete(authenticate, DeletePost);

export default router;
