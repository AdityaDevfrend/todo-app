'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900" />
              <motion.div
                className="absolute inset-6 rounded-full bg-white/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome to Todo App
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Organize your tasks efficiently
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
          <h2 className="text-2xl font-bold mb-2 text-center text-white">Get Started</h2>
          <p className="text-gray-300 mb-8 text-center">Create an account to start managing your todos</p>
          <div className="flex flex-col gap-4">
            <Link href="/signup">
              <button 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg transition-all hover:opacity-90"
              >
                Create Account
              </button>
            </Link>
            <div className="text-center text-gray-300 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors">Login</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
