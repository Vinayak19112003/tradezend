"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Anony Trading</h1>
        <p className="mt-2 text-gray-600">Authentication has been removed. Proceed to the app.</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
