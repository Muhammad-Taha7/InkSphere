import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 py-12 text-white">
      {/* Background Subtle Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Large 404 Text */}
        <h1 className="text-8xl font-extrabold tracking-widest text-yellow-400 sm:text-9xl">
          404
        </h1>

        {/* Subheading */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-base text-gray-400 sm:text-lg">
          The page you are looking for doesn't exist or has been moved to another URL on InkSphere.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-yellow-400 hover:bg-black hover:text-yellow-400"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-yellow-400 bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-transparent hover:text-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

    
      </div>
    </div>
  );
};

export default NotFound;