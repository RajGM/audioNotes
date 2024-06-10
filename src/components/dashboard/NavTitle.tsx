'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

const NavTitle = () => {
  const pathname = usePathname();

  const title =
    pathname === '/home'
      ? 'Voice Transcription'
      : pathname === '/pricing'
        ? 'Pricing'
        : pathname === '/history'
          ? 'History'
          : 'Dashboard';

  return (
    <>
      <div className='text-lg font-semibold text-default'>{title}</div>
    </>
  );
};

export default NavTitle;
