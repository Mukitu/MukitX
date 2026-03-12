import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Loader2, Eye, EyeOff, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      alert('Registration successful! Please check your email for confirmation.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 glass dark:glass-dark rounded-[2.5rem]"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">M</div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-secondary/60 dark:text-white/60">Join the MukitX community today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-gradient py-4 flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t dark:border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('github')}
              className="py-4 rounded-2xl border dark:border-white/10 flex items-center justify-center gap-3 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Github size={20} /> GitHub
            </button>
            <button 
              onClick={() => handleSocialLogin('google')}
              className="py-4 rounded-2xl border dark:border-white/10 flex items-center justify-center gap-3 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Chrome size={20} /> Google
            </button>
          </div>
          <p className="text-center text-sm text-secondary/60 dark:text-white/60">
            Already have an account? <Link to="/login" className="text-primary font-bold">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
