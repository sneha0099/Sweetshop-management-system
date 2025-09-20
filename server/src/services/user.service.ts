import { User } from '../models/user.model';

export interface UserData {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export const createUser = async (data: UserData) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser = await User.create(data);
    return newUser;
  } catch (err) {
    console.error('❌ Error creating user:', err);
    throw err;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    console.log(isPasswordValid)

    return user;
  } catch (error) {
    console.error('❌ Error authenticating user:', error);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('❌ Error finding user by ID:', error);
    throw error;
  }
};

