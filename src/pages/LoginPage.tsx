import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'reset';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, signUp, googleSignIn, forgotPassword } = useAuth();

    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'reset') {
                await forgotPassword(email);
                setResetSent(true);
            } else if (mode === 'signup') {
                if (!displayName.trim()) {
                    setError('Please enter your name');
                    setLoading(false);
                    return;
                }
                await signUp(email, password, displayName);
                navigate('/');
            } else {
                await signIn(email, password);
                navigate('/');
            }
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/email-already-in-use') setError('This email is already registered. Try signing in.');
            else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Invalid email or password.');
            else if (code === 'auth/user-not-found') setError('No account found with this email.');
            else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.');
            else if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
            else setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await googleSignIn();
            navigate('/');
        } catch (err: any) {
            if (err?.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-in failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
            {/* AI Generated 3D Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mix-blend-normal opacity-70"
                style={{ backgroundImage: "url('/src/assets/login-bg.png')" }}
            />
            {/* Animated background orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
                    animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ top: '-10%', left: '-10%' }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]"
                    animate={{ x: [0, -60, 80, 0], y: [0, 100, -40, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ bottom: '-5%', right: '-5%' }}
                />
                <motion.div
                    className="absolute w-[300px] h-[300px] rounded-full bg-white/40 blur-[80px]"
                    animate={{ x: [0, 50, -30, 0], y: [0, -50, 70, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ top: '40%', right: '20%' }}
                />
            </div>

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-[440px] mx-4"
            >
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-900/10 border border-white/60 p-8 sm:p-10">
                    {/* Branding */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 mb-6 bg-[#DCECED]/50 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-white/60 shrink-0"
                        >
                            <img
                                src="/src/assets/hero-decoration.png"
                                alt="3D Theme Decoration"
                                className="w-[120%] h-[120%] object-cover scale-110 drop-shadow-sm mix-blend-multiply"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </motion.div>

                        <div className="flex items-center justify-center gap-2 mb-2">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-secondary uppercase m-0 leading-none">
                                Track Your
                            </h2>
                            <div className="relative inline-block w-fit">
                                <div className="absolute inset-0 bg-primary translate-x-1 translate-y-0.5 rounded-sm -z-10" />
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-secondary uppercase relative z-10 m-0 px-1.5 py-0.5 leading-none">
                                    HABITS!
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm font-medium text-secondary/60 mt-2">
                            {mode === 'reset' ? 'Reset your password' : mode === 'signup' ? 'Create your premium account' : 'Welcome back to your workspace'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Reset success message */}
                            {mode === 'reset' && resetSent ? (
                                <div className="text-center py-6">
                                    <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <p className="text-sm text-neutral-600 mb-6">
                                        Password reset link sent to <strong>{email}</strong>. Check your inbox!
                                    </p>
                                    <button
                                        onClick={() => { setMode('signin'); setResetSent(false); }}
                                        className="text-sm font-bold text-secondary hover:text-secondary/80"
                                    >
                                        ← Back to Sign In
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Error alert */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Name field (signup only) */}
                                    {mode === 'signup' && (
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-secondary/10 text-sm
                                   text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/20
                                   focus:border-secondary/30 transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Email field */}
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm
                                 text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                                 focus:border-cyan-400 transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Password field (not for reset) */}
                                    {mode !== 'reset' && (
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm
                                   text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                                   focus:border-cyan-400 transition-all"
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}

                                    {/* Forgot password link */}
                                    {mode === 'signin' && (
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={() => { setMode('reset'); setError(''); }}
                                                className="text-xs font-bold text-secondary/60 hover:text-secondary transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl bg-secondary text-white text-sm font-black tracking-wide
                               shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:bg-secondary/90
                               transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2 uppercase"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {mode === 'reset' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Divider + Google (not for reset) */}
                            {mode !== 'reset' && (
                                <>
                                    <div className="flex items-center gap-3 my-5">
                                        <div className="flex-1 h-px bg-neutral-200" />
                                        <span className="text-xs text-neutral-400 font-medium">or</span>
                                        <div className="flex-1 h-px bg-neutral-200" />
                                    </div>

                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl border-2 border-secondary/10 bg-white text-sm font-black tracking-wide text-secondary
                               hover:bg-neutral-50 hover:border-secondary/20 transition-all duration-200
                               flex items-center justify-center gap-3 disabled:opacity-60 uppercase"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                </>
                            )}

                            {/* Toggle mode */}
                            <p className="text-center text-xs font-medium text-secondary/60 mt-6">
                                {mode === 'reset' ? (
                                    <button
                                        onClick={() => { setMode('signin'); setError(''); setResetSent(false); }}
                                        className="font-black text-secondary hover:text-secondary/80 ml-1"
                                    >
                                        ← Back to Sign In
                                    </button>
                                ) : mode === 'signin' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            onClick={() => { setMode('signup'); setError(''); }}
                                            className="font-black text-secondary hover:text-secondary/80 ml-1"
                                        >
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => { setMode('signin'); setError(''); }}
                                            className="font-black text-secondary hover:text-secondary/80 ml-1"
                                        >
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Subtle footer */}
                <p className="text-center text-[10px] text-neutral-400 mt-4">
                    Your data is securely stored with Firebase
                </p>
            </motion.div>
        </div>
    );
};
