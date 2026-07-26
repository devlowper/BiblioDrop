import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-brand/10 bg-brand-ink">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-[#1a1f36]">
                Biblio<span className="text-brand">Drop</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Your local library, delivered. Discover titles from independent owners and
              librarians — reading made simple.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-semibold text-[#1a1f36] mb-4">Quick links</h3>
            <ul className="space-y-3">
              {['About Us', 'Contact', 'Privacy Policy'].map((label) => (
                <li key={label}>
                  <Link to="/" className="text-sm text-gray-500 hover:text-brand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-semibold text-[#1a1f36] mb-4">Stay connected</h3>
            <p className="text-gray-500 text-sm mb-4">Get new arrivals and flash sales in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="px-4 py-2.5 rounded-full bg-white border border-brand/20 focus:outline-none focus:border-brand text-sm w-full text-black placeholder-gray-400"
                required
              />
              <Button variant="primary" type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand/15 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} BiblioDrop. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">Online book delivery</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
