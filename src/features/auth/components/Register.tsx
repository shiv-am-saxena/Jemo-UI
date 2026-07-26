import { Link, useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'sonner'
import useAuth from '../hooks/useAuth'
import { isAxiosError } from 'axios'

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const errorMessage = searchParams.get("error");
        if (errorMessage) {
            toast.error(decodeURIComponent(errorMessage));
            searchParams.delete("error");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    // Watch the password field in real-time
    const password = useWatch({ control, name: 'password', defaultValue: '' })

    // Derive validation checks directly from the watched password string
    const passwordChecks = {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    }
    const { handleRegister } = useAuth();
    const onSubmit = async (data: { name: string; email: string; password: string }) => {
        try {
            setIsLoading(true);
            const response = await handleRegister(data)
            const message = response
            toast.success(message);
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Registration failed";
                console.error("Registration Error:", errorMessage);
                toast.error(errorMessage);
            } else {
                console.error("Unexpected Error:", error);
                toast.error("Registration failed due to an unexpected error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }
    const handleOAuthLogin = (provider: string) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    };
    return (
        <>
            <h3 className="text-white text-2xl text-center font-bold">Register</h3>
            <p className="text-white text-center">Create an account to get started.</p>
            <div className="w-full max-w-md my-3 border border-zinc-600 rounded-lg p-6 bg-[#1e1e1e]">
                {/* Registration form */}
                <div className="social flex gap-4">
                    <button onClick={() => handleOAuthLogin("google/register")} className="w-full flex items-center justify-center gap-2 border border-zinc-600 rounded-lg p-2 mb-4 hover:bg-[#2e2e2e]">
                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-white">Google</span>
                    </button>
                    <button onClick={() => handleOAuthLogin("github")} className="w-full flex items-center justify-center gap-2 border border-zinc-600 rounded-lg p-2 mb-4 hover:bg-[#2e2e2e]">
                        <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
                        <span className="text-white">GitHub</span>
                    </button>
                </div>

                <div className="divider mt-2 text-white text-center flex gap-2 items-center">
                    <div className="w-full h-px bg-zinc-500" />OR<div className="w-full h-px bg-zinc-600" />
                </div>

                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-white">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 rounded-lg bg-[#1e1e1e] border border-zinc-600 text-white focus:outline-none focus:border-blue-500"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="text-red-400 text-sm">{String(errors.name.message)}</p>}
                    </div>

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

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-white">Password</label>

                        {/* Relative wrapper for the input and button */}
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full p-2 pr-10 rounded-lg bg-[#1e1e1e] border border-zinc-600 text-white focus:outline-none focus:border-blue-500"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long',
                                    },
                                    validate: {
                                        uppercase: value => /[A-Z]/.test(value) || 'Password must include an uppercase letter',
                                        lowercase: value => /[a-z]/.test(value) || 'Password must include a lowercase letter',
                                        number: value => /\d/.test(value) || 'Password must include a number',
                                        symbol: value => /[^A-Za-z0-9]/.test(value) || 'Password must include a symbol',
                                    },
                                })}
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

                        {/* Dynamic Password Checklist */}
                        <ul className="text-sm list-none list-inside flex flex-wrap w-full mt-2 gap-y-1">
                            <li className={`w-1/2 transition-colors duration-200 ${passwordChecks.minLength ? 'text-green-500' : 'text-zinc-400'}`}>
                                {passwordChecks.minLength ? '✓' : '○'} 8+ Characters
                            </li>
                            <li className={`w-1/2 transition-colors duration-200 ${passwordChecks.uppercase ? 'text-green-500' : 'text-zinc-400'}`}>
                                {passwordChecks.uppercase ? '✓' : '○'} One uppercase
                            </li>
                            <li className={`w-1/2 transition-colors duration-200 ${passwordChecks.symbol ? 'text-green-500' : 'text-zinc-400'}`}>
                                {passwordChecks.symbol ? '✓' : '○'} One symbol
                            </li>
                            <li className={`w-1/2 transition-colors duration-200 ${passwordChecks.number ? 'text-green-500' : 'text-zinc-400'}`}>
                                {passwordChecks.number ? '✓' : '○'} One number
                            </li>
                        </ul>

                        {/* Only show the first error message to avoid cluttering the UI when everything is invalid */}
                        {errors.password && <p className="text-red-400 text-sm mt-1">{String(errors.password.message)}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors mt-2">
                        Register
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-white text-center text-sm">Already have an account? <Link to="/auth/login" className="text-blue-500 hover:underline">Login</Link></p>
                </div>
            </div>

            <p className="text-zinc-400 text-center max-w-md text-sm mt-4">
                By creating an account, you agree to our <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
            </p>
        </>
    )
}

export default Register