'use client';

import { useTheme } from 'next-themes';
import React from 'react';

// Define the interface for the component props

const LibraryIcon: React.FC = () => {
  const { theme } = useTheme();

  const fillColor = theme === 'dark' ? 'white' : '#3E3E3E';
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill={fillColor}>
      <path
        d='M6.38175 1.5H11.6168C11.7908 1.5 11.9243 1.5 12.0413 1.51125C12.8723 1.593 13.5525 2.0925 13.8412 2.76525H4.15725C4.446 2.0925 5.12625 1.593 5.95725 1.51125C6.07275 1.5 6.20625 1.5 6.38175 1.5ZM4.73175 3.54225C3.68925 3.54225 2.83425 4.17225 2.54925 5.00775C2.543 5.02516 2.537 5.04267 2.53125 5.06025C2.82975 4.97025 3.141 4.91025 3.45525 4.8705C4.26525 4.76625 5.28975 4.76625 6.47925 4.76625H11.6483C12.8378 4.76625 13.8615 4.76625 14.6722 4.8705C14.9872 4.911 15.2978 4.9695 15.5963 5.06025C15.5908 5.04265 15.585 5.02515 15.579 5.00775C15.294 4.17225 14.439 3.54225 13.3958 3.54225H4.73175Z'
        fill={fillColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.50425 5.65625H11.4962C14.0267 5.65625 15.2927 5.65625 16.0037 6.3965C16.714 7.13675 16.5467 8.27975 16.2122 10.5665L15.8957 12.7355C15.6332 14.5288 15.502 15.4258 14.8292 15.9628C14.1565 16.4998 13.1642 16.4998 11.179 16.4998H6.8215C4.837 16.4998 3.844 16.4998 3.17125 15.9628C2.4985 15.4258 2.36725 14.5288 2.10475 12.7355L1.78825 10.5673C1.453 8.27975 1.28575 7.13675 1.99675 6.3965C2.70775 5.65625 3.97375 5.65625 6.50425 5.65625ZM6.00025 13.4998C6.00025 13.1892 6.28 12.9373 6.625 12.9373H11.3755C11.7205 12.9373 12.0002 13.1892 12.0002 13.4998C12.0002 13.8103 11.7205 14.0623 11.3755 14.0623H6.625C6.28 14.0623 6.00025 13.8103 6.00025 13.4998Z'
        fill={fillColor}
      />
    </svg>
  );
};

export default LibraryIcon;