"use client";

import { GoogleTagManager } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GoogleTagManagerWrapper({ gtmId }: { gtmId: string }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Delay GTM initialization until the page is fully ready 
    // This dramatically improves Speed Index and LCP
    const timer = setTimeout(() => {
      setMounted(true);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
