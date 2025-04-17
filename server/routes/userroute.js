import express from 'express'
import {
    registerUser, LoginUser, userCredits, paymentRazorpay,verifyRazorpay
} from '../controllers/usercontroller.js'
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router()
userRouter.post('/register', registerUser);
userRouter.post('/login', LoginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/razor-pay', userAuth, paymentRazorpay);
userRouter.post('/verify-pay', userAuth, verifyRazorpay);
export default userRouter;

