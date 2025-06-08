import UploadForm from '@/components/UploadForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text mb-2">
            Glass Gallery
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            A sleek, modern image gallery with client-side persistence using
            Dexie.js. Your images are stored locally in your browser.
          </p>
        </header>
        <UploadForm />
      </div>
      <Link
        className="
    relative inline-flex items-center justify-center
    px-6 py-3 
    bg-gradient-to-r from-gray-900 via-black to-gray-900
    text-white font-bold text-lg
    rounded-full
    shadow-2xl shadow-black/50
    border border-gray-800
    overflow-hidden
    group
    transition-all duration-300
    hover:scale-105 hover:shadow-3xl hover:shadow-black/70
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:translate-x-[-100%] before:skew-x-12
    hover:before:translate-x-[100%] before:transition-transform before:duration-700
    after:absolute after:inset-0
    after:bg-gradient-to-r after:from-blue-500/10 after:via-purple-500/10 after:to-pink-500/10
    after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
  "
        href="/gallery"
      >
        <span className="relative z-10 flex items-center gap-2">
          Gallery
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </Link>
    </main>
  );
}
