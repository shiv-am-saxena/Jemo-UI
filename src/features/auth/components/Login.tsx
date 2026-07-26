import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState, type JSX } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { setUser } from '../../../context/userSlice';
import { toast } from 'sonner';
import useAuth from '../hooks/useAuth';
import { isAxiosError } from 'axios';

function Login(): JSX.Element {

    const [showPassword, setShowPassword] = useState(false)
    const { isLoading } = useAppSelector(state => state.auth)
    const { handleLogin } = useAuth()
    const dispatch = useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const response = await handleLogin(data);
            const { user, token } = response;
            localStorage.setItem('token', token)
            dispatch(setUser({ user: user, token }))
            toast.success("Login successful!")
        }
        catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Login failed";
                console.error("Login Error:", errorMessage);
                toast.error(errorMessage);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("Login failed due to an unexpected error. Please try again.");
            }
        }
    }
    const handleOAuthLogin = (provider: string) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    };
    return (
        <>
            <h3 className="text-white text-2xl text-center font-bold">Welcome Back</h3>
            <p className="text-white text-center">Log in to your account to continue.</p>

            <div className="w-full max-w-md my-3 border border-zinc-600 rounded-lg p-6 bg-[#1e1e1e]">
                {/* Social Login */}
                <div className="social flex gap-4">
                    <button onClick={() => handleOAuthLogin("google")} className="w-full flex items-center justify-center gap-2 border border-zinc-600 rounded-lg p-2 mb-4 hover:bg-[#2e2e2e] transition-colors">
                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-white">Google</span>
                    </button>
                    <button onClick={() => handleOAuthLogin("github")} className="w-full flex items-center justify-center gap-2 border border-zinc-600 rounded-lg p-2 mb-4 hover:bg-[#2e2e2e] transition-colors">
                        <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
                        <span className="text-white">GitHub</span>
                    </button>
                </div>

                <div className="divider mt-2 text-white text-center flex gap-2 items-center">
                    <div className="w-full h-px bg-zinc-500" />OR<div className="w-full h-px bg-zinc-600" />
                </div>

                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-white">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 rounded-lg bg-[#1e1e1e] border border-zinc-600 text-white focus:outline-none focus:border-blue-500"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-red-400 text-sm">{String(errors.email.message)}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-white">Password</label>
                            <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Relative wrapper for the input and button */}
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full p-2 pr-10 rounded-lg bg-[#1e1e1e] border border-zinc-600 text-white focus:outline-none focus:border-blue-500"
                                {...register('password', { required: 'Password is required' })}
                            />

                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-sm mt-1">{String(errors.password.message)}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors mt-2">
                        Log In
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-white text-center text-sm">
                        Don't have an account? <Link to="/auth/register" className="text-blue-500 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login