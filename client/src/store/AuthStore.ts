import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_AUTH_URL;

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: 'user' | 'admin';
    verified?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstname: string,
        lastname: string,
        role: 'user' | 'admin',
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    verify: (otp: string, userId: string) => Promise<void>;
    resendOtp: (userId: string, email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (email: string, password: string) => {
                try {
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await response.json();
               
                    if (data.success) {
            
                        set({ 
                            user: data.user, 
                            token: data.token,
                            isAuthenticated: true 
                        });
                        
                    } else {
                        throw new Error('Login failed!');
                    }
                } catch (error: unknown) {
                    throw new Error(error instanceof Error ? error.message : 'Unknown error');
                }
            },
            register: async (
                firstname: string,
                lastname: string,
                role: 'user' | 'admin',
                email: string,
                password: string
            ) => {
                try {
                    const response = await fetch(`${API_URL}/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firstname,
                            lastname,
                            role,
                            email,
                            password,
                        }),
                    });
                    const data = await response.json();

                    if (response.ok && data.success) {
                        set({ user: data.user, isAuthenticated: false });
                    } else {
                        throw new Error(data.message || 'Registration failed!');
                    }
                } catch (error: unknown) {
                    console.error('Registration fetch error:', error);
                    throw new Error(error instanceof Error ? error.message : 'Unknown error');
                }
            },
            logout: async () => {
                try {
                    const response = await fetch('/api/auth/logout', {
                        method: 'POST',
                    });
                    const data = await response.json();
                    if (data.success) {
                        set({ user: null, token: null, isAuthenticated: false });
                    } else {
                        throw new Error('Logout failed!');
                    }
                } catch (error: unknown) {
                    throw new Error(error instanceof Error ? error.message : 'Unknown error');
                }
            },
            verify: async (otp: string, userId: string) => {
                try {
                    const response = await fetch(`${API_URL}/verify-otp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ otp, userId }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        set({ 
                            user: data.user, 
                            token: data.token,
                            isAuthenticated: true 
                        });
                    } else {
                        throw new Error('Verification failed!');
                    }
                } catch (error: unknown) {
                    throw new Error(error instanceof Error ? error.message : 'Unknown error');
                }
            },
            resendOtp: async (userId: string, email: string) => {
                try {
                    const response = await fetch(`${API_URL}/resend-otp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, email }),
                    });
                    const data = await response.json();
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Resend OTP failed!');
                    }
                    // Don't set user data for resend OTP, just indicate success
                } catch (error: unknown) {
                    console.error('Resend OTP fetch error:', error);
                    throw new Error(error instanceof Error ? error.message : 'Unknown error');
                }
            },
        }),
            {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state: AuthState) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
