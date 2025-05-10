"use client";

import React from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 pt-12 pb-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Section gauche */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">FitCoachIA PRO</h4>
            <p className="text-sm mb-4">
              Boostez vos performances avec l’intelligence artificielle. Planifiez, suivez et progressez.
            </p>
            <div className="flex space-x-4 mt-4 text-xl">
              <Link href="https://github.com/ClarisseMarcet" target="_blank" aria-label="GitHub" className="hover:text-white transition-colors duration-300">
                <FaGithub />
              </Link>
              <Link href="https://www.linkedin.com/in/eil-clarisse" target="_blank" aria-label="LinkedIn" className="hover:text-white transition-colors duration-300">
                <FaLinkedin />
              </Link>
              <Link href="#" aria-label="Facebook" className="hover:text-white transition-colors duration-300">
                <FaFacebookF />
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-white transition-colors duration-300">
                <FaTwitter />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-white transition-colors duration-300">
                <FaInstagram />
              </Link>
            </div>
          </div>

          {/* Section liens rapides */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">Liens rapides</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white transition">Technologies</Link></li>
              <li><Link href="#" className="hover:text-white transition">Application</Link></li>
              <li><Link href="#" className="hover:text-white transition">Avis</Link></li>
              <li><Link href="#" className="hover:text-white transition">Tarifs</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Section contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📧</span> eliclarissea@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📞</span> +33 6 12 34 56 78
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📍</span> 75017 Paris, France
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-4 md:mb-0">&copy; {new Date().getFullYear()} FitCoachIA. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-white transition">Confidentialité</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition">CGU</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
