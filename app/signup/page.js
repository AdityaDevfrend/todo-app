'use client';
import Link from "next/link";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setShowConfirmation(true);
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link. Please check your email to verify your account.",
        duration: 5000
      });
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
      {/* Left Side */}
      <div className="hidden md:flex flex-col w-1/2 p-12">
        <div className="flex flex-col items-center justify-center flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="relative w-32 h-32 mb-8"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900" />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join Todo App
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Start your productivity journey today
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div
                className="w-3 h-3 rounded-full bg-pink-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-purple-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-indigo-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 flex-col justify-center items-center">
        <motion.div 
          className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {showConfirmation ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Check your email</h2>
                <p className="text-gray-300 mb-6">
                  We've sent a confirmation link to {email}. Please check your email to verify your account.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg transition-all hover:opacity-90"
                >
                  Go to Login
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center text-white">Create Account</h2>
              <p className="text-gray-300 mb-8 text-center">Join us and boost your productivity</p>
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
              </form>
              <div className="text-center mt-4 text-gray-300 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors">Login</Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
