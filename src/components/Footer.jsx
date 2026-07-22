import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-white px-6 pb-16 pt-6 text-gray-900 md:px-12 lg:px-20 border-t border-gray-100">
      {/* Top Divider Line */}
      <div className="mb-12 w-full border-t border-gray-100"></div>

      {/* Main Container */}
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-12 lg:flex-row lg:gap-16">
        
        {/* Left Side: Brand Logo & Tagline */}
        <div className="max-w-2xl">
          {/* Logo Badge */}
          <div className="mb-6 flex items-start gap-2">
            <div className="flex flex-col text-xl font-bold leading-none tracking-widest uppercase">
              <span className="flex items-center gap-2 text-xs font-semibold text-yellow-600 tracking-widest mb-1">
                <span className="inline-block h-2 w-2 rounded-full bg-yellow-400"></span>
                THE PLATFORM
              </span>
              <span className="text-2xl font-black text-gray-900">InkSphere</span>
            </div>
          </div>

          {/* Main Description */}
          <p className="font-serif text-2xl font-semibold leading-snug text-gray-600 md:text-3xl lg:text-[2rem]">
            A space for thinkers, creators, and storytellers. We believe in the power of words to connect, inspire, and shape the world. Join us in shaping the narrative.
          </p>
        </div>

        {/* Right Side: Contact & Social Columns */}
        <div className="flex flex-col gap-12 sm:flex-row sm:gap-20 lg:pt-4">
          
          {/* Contact Section */}
          <div className="space-y-4 text-sm text-gray-600">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Contact</h4>

            <div className="space-y-1">
              <p className="font-medium text-gray-800">Address:</p>
              <p>500 Innovation Street,</p>
              <p>Tech Hub, CA 94158</p>
            </div>

            <div className="pt-2 space-y-1">
              <p className="font-medium text-gray-800">Email:</p>
              <p className="hover:text-yellow-600 transition-colors cursor-pointer">hello@inksphere.com</p>
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-4 text-sm text-gray-600">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Connect</h4>

            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-yellow-600"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-yellow-600"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-yellow-600"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="mx-auto max-w-[1600px] mt-16 pt-8 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} InkSphere. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;