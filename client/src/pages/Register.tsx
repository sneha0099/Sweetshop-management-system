import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterSchema } from '@/types/AuthSchema';
import {useAuthStore} from '@/store/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const RegisterUser = useAuthStore((state) => state.register);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            role: 'user'
        }
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        try {
            console.log('Registration data:', data); // Debug log
            await RegisterUser(
                data.firstName,
                data.lastName, 
                data.role || 'user',
                data.email, 
                data.password,
                
            );
            console.log('Registration successful'); // Debug log
            toast.success('Registration successful! Please check your email for verification.');
            reset();
            
            // Navigate to verify page after showing the toast
            setTimeout(() => {
                navigate('/verify');
            }, 3000); // Increased to 3 seconds to ensure toast is visible
        } catch (error: unknown) {
            console.error('Registration error:', error); // Debug log
            toast.error(
                error instanceof Error ? error.message : 'Registration failed!'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full p-5 mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create a new account by filling out the details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Label htmlFor="firstName" className="mb-2 block">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                {...register('firstName')}
                            />
                            {errors.firstName && (
                                <p className="errorMsgStyle">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="lastName" className="mb-2 block">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                {...register('lastName')}
                            />
                            {errors.lastName && (
                                <p className="errorMsgStyle">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="email" className="mb-2 block">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="errorMsgStyle">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="role" className="mb-2 block">Role</Label>
                            <Select defaultValue="user" onValueChange={(value) => {
                                setValue('role', value as 'user' | 'admin');
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="errorMsgStyle">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="password" className="mb-2 block">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeIcon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <EyeOffIcon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="errorMsgStyle">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

