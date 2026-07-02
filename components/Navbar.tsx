'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  if (!role) return null; // Don't render navbar on login/register

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2 font-semibold text-lg">
          <Shield className="w-6 h-6 text-primary" />
          QuisShield
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          {role === 'admin' ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/admin/campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
              <Link href="/admin/qr-generator" className="hover:text-primary transition-colors">QR Generator</Link>
              <Link href="/admin/reports" className="hover:text-primary transition-colors">Reports</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/dashboard/scan" className="hover:text-primary transition-colors">QR Scanner</Link>
              <Link href="/dashboard/training" className="hover:text-primary transition-colors">Training</Link>
              <Link href="/dashboard/quiz" className="hover:text-primary transition-colors">Quizzes</Link>
              <Link href="/dashboard/recommendations" className="hover:text-primary transition-colors">Recommendations</Link>
              <Link href="/dashboard/verify" className="hover:text-primary transition-colors">Verify</Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
