import { Router } from 'express';
import { register, login, resendOtp, verifyOtp } from '../controller/user.controller';
import validate from '../middlewares/validate.middleware';
import { RegisterSchema, LoginSchema, ResendOtpSchema, VerifyOtpSchema } from '../validators/auth.schema';

const userRoutes = Router();

userRoutes.post('/register', validate(RegisterSchema), register);
userRoutes.post('/login', validate(LoginSchema), login);
userRoutes.post('/verify-otp', validate(VerifyOtpSchema), verifyOtp);
userRoutes.post('/resend-otp', validate(ResendOtpSchema), resendOtp);

export default userRoutes;