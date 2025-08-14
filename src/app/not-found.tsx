
'use client';

import NotFound from '@/components/shell/not-found';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <NotFound
      imageLight="https://placehold.co/800x600.png"
      imageDark="https://placehold.co/800x600.png"
      onButtonClick={() => router.push('/dashboard')}
    />
  );
}
