"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
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
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
              >
                Accueil
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                  >
                    Tableau de bord
                  </Link>
                  
                  <Link 
                    href="/calculator" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                  >
                    Calculateur
                  </Link>
                  
                  <Link 
                    href="/history" 
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
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
                  <span className="text-gray-700 mr-4">
                    {userProfile?.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              Accueil
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Tableau de bord
                </Link>
                
                <Link 
                  href="/calculator" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Calculateur
                </Link>
                
                <Link 
                  href="/history" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Historique
                </Link>
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">
                  {userProfile?.displayName || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link 
                  href="/login" 
                  className="block text-base font-medium text-gray-500 hover:text-gray-700"
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="block text-base font-medium text-gray-500 hover:text-gray-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}; 