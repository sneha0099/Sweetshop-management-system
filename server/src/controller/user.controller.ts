import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import { authenticateUser } from '../services/user.service';
import { sendOtpMail } from '../utils/sendOtpMailer';
import { OtpVerification } from '../models/otp.model';
import { User } from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, role, email, password } = req.body;

    const newUser = await createUser({ firstname, lastname, role, email, password });

    // Send OTP to user's email
    await sendOtpMail(newUser._id, newUser.email);

    // Return consistent response format
    const userResponse = {
      id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP verification.',
      user: userResponse
    });
  } catch (err: any) {
    if (err.message === 'User already exists') {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error('❌ Registration error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Authenticate user
        const user = await authenticateUser(email, password);

        // Generate token
        const token = user.generateToken();

        // Remove password from response
        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            verified: user.verified
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token
        });
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.error('❌ Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body;

    if(!userId || !email) {
        return res.status(400).json({ 
            success: false, 
            message: 'User ID and email are required' 
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }

    // Check if user is already verified
    if (user.verified) {
        return res.status(400).json({ 
            success: false, 
            message: 'User is already verified' 
        });
    }

    // Delete existing OTP if any
    const existingOtpRecord = await OtpVerification.findOne({ userId });
    if (existingOtpRecord) {
        await OtpVerification.deleteOne({ userId });
    }

    try {
        await sendOtpMail(userId, email);
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error sending OTP email' 
        });
    }

    res.status(200).json({ 
        success: true, 
        message: 'OTP resent successfully! Please check your email.' 
    });
  } catch (error: any) {
    console.error('❌ Resend OTP error:', error);
    return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp, userId } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'User ID and OTP are required' 
        });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }

    // Check if user is already verified
    if (user.verified) {
        return res.status(400).json({ 
            success: false, 
            message: 'User is already verified' 
        });
    }

    // Find the OTP verification record
    const otpVerificationRecord = await OtpVerification.findOne({ userId });
    if (!otpVerificationRecord) {
        return res.status(400).json({ 
            success: false, 
            message: 'OTP not found or expired. Please request a new OTP.' 
        });
    }

    // Check if OTP has expired
    const currentTime = new Date();
    if (currentTime > otpVerificationRecord.expiresAt) {
        // Delete expired OTP
        await OtpVerification.deleteOne({ userId });
        return res.status(400).json({ 
            success: false, 
            message: 'OTP has expired. Please request a new OTP.' 
        });
    }

    // Verify the OTP
    if (otpVerificationRecord.otp !== otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid OTP. Please try again.' 
        });
    }

    // OTP is valid - update user verification status
    user.verified = true;
    await user.save();

    // Delete the OTP record as it's no longer needed
    await OtpVerification.deleteOne({ userId });

    // Generate token for the verified user
    const token = user.generateToken();

    // Return success response
    const userResponse = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        verified: user.verified
    };

    res.status(200).json({ 
        success: true,
        message: 'OTP verified successfully. Your account is now active!',
        user: userResponse,
        token
    });

  } catch (error: any) {
    console.error('❌ Verify OTP error:', error);
    return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
  }
};