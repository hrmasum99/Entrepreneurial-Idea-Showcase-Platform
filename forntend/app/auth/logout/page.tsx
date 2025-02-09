'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('token');
    // Optionally clear other sensitive data
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminProfile');

    // Redirect to the login page
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-semibold">Logging you out...</h2>
    </div>
  );
}
