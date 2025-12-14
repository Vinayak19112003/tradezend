"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Authentication Removed</h1>
        <p className="mt-2 text-gray-600">Signup is disabled. Go to the dashboard to use the app.</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
