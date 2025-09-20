import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/types/AuthSchema';
import { useAuthStore } from '@/store/AuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const loginUser = useAuthStore((state) => state.login);

    // Get the intended destination from location state, default to inventory
    const from = (location.state as { from?: Location })?.from?.pathname || '/inventory';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        try {
            await loginUser(data.email, data.password);
            toast.success('Login successful!');
            reset();
            navigate(from, { replace: true });
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : 'Login failed'
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full p-5 mx-auto bg-lightTheme">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        {' '}
                        Enter your email and password to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
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

                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <Label htmlFor="password">Password</Label>
                                <p className="text-sm underline">
                                    <Link to="/forgot-password">
                                        Forgot your password?
                                    </Link>
                                </p>
                            </div>
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
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
