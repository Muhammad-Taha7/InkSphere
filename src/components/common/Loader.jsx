import React from 'react';

const Loader = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300 ${fullScreen ? 'min-h-screen' : 'h-full w-full py-12'}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute h-16 w-16 animate-[spin_3s_linear_infinite] rounded-full border-4 border-dashed border-yellow-400/30"></div>
        
        {/* Inner Ring */}
        <div className="absolute h-12 w-12 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-4 border-solid border-transparent border-t-yellow-400 border-b-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
        
        {/* Core Dot */}
        <div className="h-4 w-4 animate-pulse rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
      </div>
      
      {text && (
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
