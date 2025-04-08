"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Ajouter un effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                CoachIA
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                Accueil
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
                  >
                    Tableau de bord
                  </Link>
                  
                  <Link 
                    href="/calculator" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
                  >
                    Calculateur
                  </Link>
                  
                  <Link 
                    href="/history" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
                  >
                    Historique
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4 hidden md:block">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden transition-all duration-300 ease-in-out`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link 
            href="/" 
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          
          {user && (
            <>
              <Link 
                href="/dashboard" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tableau de bord
              </Link>
              
              <Link 
                href="/calculator" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Calculateur
              </Link>
              
              <Link 
                href="/history" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Historique
              </Link>
            </>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
          {user ? (
            <div className="px-4 py-2">
              <div className="text-base font-medium text-gray-800 mb-3">
                {user.displayName || user.email}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-base font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Connexion
              </Link>
              <Link 
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; 