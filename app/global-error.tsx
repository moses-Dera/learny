"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// This file catches errors in the root layout.tsx itself.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`dark ${inter.className} antialiased`}>
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#15110F] text-[#F2E8E1] p-4 text-center">
        <h1 className="text-4xl font-bold text-[#E60000] mb-4">Critical System Error</h1>
        <p className="text-[#A89F98] max-w-md mx-auto mb-8">
          The application layout failed to load. 
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#E06C19] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          Attempt Recovery
        </button>
      </body>
    </html>
  );
}
