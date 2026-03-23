'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="text-[120px] font-bold text-red-600">C</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[150px] w-[150px] animate-spin rounded-full border-t-2 border-b-2 border-red-600" />
          </div>
        </div>
        <div className="h-2.5 w-64 rounded-full bg-gray-700">
          <div
            className="h-2.5 rounded-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-white">Carregando recursos...</p>
      </div>
    </div>
  );
}
