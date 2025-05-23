'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-navy-900 border-b border-navy-800">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg text-white hover:text-navy-200 transition-colors">TodoApp</Link>
        {user && <Link href="/dashboard" className="ml-4 text-navy-200 hover:text-white transition-colors">Dashboard</Link>}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-navy-200">{user.email}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bborder-navy-700 text-navy-200 bg-inherit"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button 
                variant="outline"
                className="border-navy-700 text-navy-200 bg-inherit"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className="bg-gradient-to-r from-navy-600 to-navy-700 text-white hover:from-navy-700 hover:to-navy-800"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
} 