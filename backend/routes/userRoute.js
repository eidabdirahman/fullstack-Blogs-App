import express from 'express';
import {
    
    userRegistration,
    userLogin
} from '../controllers/UserController.js';

const router = express.Router();



router.route('/register')
    .post(userRegistration);

router.route('/login')
    .post(userLogin);



export default router;
