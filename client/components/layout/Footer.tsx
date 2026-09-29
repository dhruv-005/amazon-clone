'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full text-white text-xs select-none mt-12">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-center py-4 font-medium transition-colors"
      >
        Back to top
      </button>

      {/* Main 4-Column Navigation Links */}
      <div className="bg-[#232f3e] py-10 px-6 sm:px-12 border-b border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Get to Know Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:underline">About Amazon</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/press" className="hover:underline">Press Releases</Link></li>
              <li><Link href="/science" className="hover:underline">Amazon Science</Link></li>
            </ul>
          </div>

          {/* Column 2: Connect with Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
            </ul>
          </div>

          {/* Column 3: Make Money with Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/seller/dashboard" className="hover:underline">Sell on Amazon</Link></li>
              <li><Link href="/affiliates" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link href="/fulfillment" className="hover:underline">Fulfilment by Amazon</Link></li>
              <li><Link href="/advertise" className="hover:underline">Advertise Your Products</Link></li>
              <li><Link href="/pay" className="hover:underline">Amazon Pay on Merchants</Link></li>
            </ul>
          </div>

          {/* Column 4: Let Us Help You */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/account" className="hover:underline">Your Account</Link></li>
              <li><Link href="/orders" className="hover:underline">Returns Centre</Link></li>
              <li><Link href="/recalls" className="hover:underline">Recalls and Safety Alerts</Link></li>
              <li><Link href="/help" className="hover:underline">100% Purchase Protection</Link></li>
              <li><Link href="/help" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand Logo & Country Strip */}
      <div className="bg-[#232f3e] py-6 text-center border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white">amazon</span>
            <span className="text-xs text-[#febd69] font-bold mt-1">.in</span>
          </Link>
          <div className="flex items-center gap-2 border border-gray-500 rounded px-3 py-1.5 text-gray-300">
            <span>🌐 English</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-500 rounded px-3 py-1.5 text-gray-300">
            <span>🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="bg-[#131921] py-8 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex justify-center space-x-4">
          <Link href="/terms" className="hover:underline">Conditions of Use & Sale</Link>
          <Link href="/privacy" className="hover:underline">Privacy Notice</Link>
          <Link href="/interest-ads" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p>&copy; 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates (Amazon Clone Portfolio Project)</p>
      </div>
    </footer>
  );
};

export default Footer;
