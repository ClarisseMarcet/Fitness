"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const { user, handleSignOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await handleSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  // Liens publics (toujours visibles)
  const publicLinks = [
    { href: "/", icon: "home", label: "Accueil" },
    { href: "/contact", icon: "envelope", label: "Contact" }
  ];

  // Menus déroulants publics (toujours visibles)
  const publicDropdowns = [
    {
      id: "activities",
      title: "Activités",
      icon: "running",
      items: [
        { href: "/entrainement", icon: "calendar-alt", label: "Séances" },
        { href: "/exercices", icon: "book", label: "Bibliothèque" },
        { href: "/FitnessDashboard", icon: "tachometer-alt", label: "Mon Espace" },
        { href: "/StravaSyncButton", icon: "strava", brandIcon: true, label: "Activités Strava" }
      ]
    },
  ];

  // Liens protégés (seulement visibles quand connecté)
  const protectedLinks = [
    { href: "/dashboard", icon: "tachometer-alt", label: "Tableau de bord" },
    { href: "/calculator", icon: "calculator", label: "Calculateur" },
    { href: "/history", icon: "history", label: "Historique" },
    { href: "/exercice", icon: "exercice", label: "Exercices" },
    { href: "/strava", icon: "strava", brandIcon: true, label: "Strava" }
  ];

  return (
    <>
      {/* Barre de navigation principale (toujours visible) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-0' : 'bg-white/95 backdrop-blur-sm py-1'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center" onClick={closeAll}>
                <span className="text-2xl font-bold text-blue-600">FitCoach</span>
                <span className="text-2xl font-bold text-blue-400">IA</span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Liens publics */}
              {publicLinks.map((link) => (
                <NavItem 
                  key={link.href}
                  href={link.href} 
                  icon={link.icon} 
                  onClick={closeAll}
                >
                  {link.label}
                </NavItem>
              ))}

              {/* Menus déroulants publics */}
              {publicDropdowns.map((dropdown) => (
                <DropdownMenu 
                  key={dropdown.id}
                  title={dropdown.title}
                  icon={dropdown.icon}
                  isActive={activeDropdown === dropdown.id}
                  onMouseEnter={() => setActiveDropdown(dropdown.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => toggleDropdown(dropdown.id)}
                >
                  {dropdown.items.map((item) => (
                    <DropdownItem 
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      brandIcon={item.brandIcon}
                      onClick={closeAll}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              ))}
            </div>

            {/* Actions utilisateur */}
            <div className="hidden md:flex items-center ml-4 space-x-3">
              {user ? (
                <div className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-full">
                  <i className="fas fa-user-circle mr-2 text-blue-500"></i>
                  {user.displayName || user.email}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* Bouton mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Ouvrir le menu</span>
                <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg border-t">
            {/* Liens publics mobile */}
            {publicLinks.map((link) => (
              <MobileNavItem 
                key={link.href}
                href={link.href} 
                icon={link.icon} 
                onClick={closeAll}
              >
                {link.label}
              </MobileNavItem>
            ))}

            {/* Menus déroulants mobile */}
            {publicDropdowns.map((dropdown) => (
              <MobileDropdown 
                key={dropdown.id}
                title={dropdown.title}
                icon={dropdown.icon}
                isOpen={activeDropdown === `${dropdown.id}-mobile`}
                onClick={() => toggleDropdown(`${dropdown.id}-mobile`)}
              >
                {dropdown.items.map((item) => (
                  <MobileDropdownItem 
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    brandIcon={item.brandIcon}
                    onClick={closeAll}
                  >
                    {item.label}
                  </MobileDropdownItem>
                ))}
              </MobileDropdown>
            ))}

            {/* Actions utilisateur mobile */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="px-2 space-y-3">
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    <i className="fas fa-user-circle mr-2 text-blue-500"></i>
                    {user.displayName || user.email}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={closeAll}
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeAll}
                    className="block px-4 py-2 text-base font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Barre de navigation protégée (seulement visible quand connecté) */}
      {user && (
        <nav className={`fixed top-16 w-full z-40 bg-blue-50 shadow-sm transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12">
              {/* Menu Desktop */}
              <div className="hidden md:flex items-center space-x-1">
                {protectedLinks.map((link) => (
                  <ProtectedNavItem 
                    key={link.href}
                    href={link.href} 
                    icon={link.icon}
                    brandIcon={link.brandIcon}
                    onClick={closeAll}
                  >
                    {link.label}
                  </ProtectedNavItem>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors ml-4"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Déconnexion
                </button>
              </div>

              {/* Menu Mobile */}
              <div className="md:hidden flex items-center w-full">
                <select 
                  className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-700"
                  onChange={(e) => {
                    if (e.target.value === 'logout') {
                      handleLogout();
                    } else {
                      router.push(e.target.value);
                    }
                    closeAll();
                  }}
                >
                  <option value="">Menu utilisateur</option>
                  {protectedLinks.map((link) => (
                    <option key={link.href} value={link.href}>
                      {link.label}
                    </option>
                  ))}
                  <option value="logout">Déconnexion</option>
                </select>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

// Composants réutilisables (avec ajout du ProtectedNavItem)

const NavItem: React.FC<{
  href: string;
  icon: string;
  brandIcon?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, icon, brandIcon = false, onClick, children }) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
    onClick={onClick}
  >
    <i className={`${brandIcon ? 'fab' : 'fas'} fa-${icon} mr-2 w-5 text-center`}></i>
    {children}
  </Link>
);

const ProtectedNavItem: React.FC<{
  href: string;
  icon: string;
  brandIcon?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, icon, brandIcon = false, onClick, children }) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
    onClick={onClick}
  >
    <i className={`${brandIcon ? 'fab' : 'fas'} fa-${icon} mr-2 w-5 text-center`}></i>
    {children}
  </Link>
);

const MobileNavItem: React.FC<{
  href: string;
  icon: string;
  brandIcon?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, icon, brandIcon = false, onClick, children }) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
    onClick={onClick}
  >
    <i className={`${brandIcon ? 'fab' : 'fas'} fa-${icon} mr-3 w-5 text-center`}></i>
    {children}
  </Link>
);

const DropdownMenu: React.FC<{
  title: string;
  icon: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isActive, onMouseEnter, onMouseLeave, onClick, children }) => (
  <div 
    className="relative"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <button
      className={`flex items-center px-3 py-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} hover:bg-gray-50 rounded-md transition-colors`}
      onClick={onClick}
    >
      <i className={`fas fa-${icon} mr-2 w-5 text-center`}></i>
      {title}
      <i className={`fas fa-chevron-down ml-1 text-xs transition-transform ${isActive ? 'transform rotate-180' : ''}`}></i>
    </button>
    
    {isActive && (
      <div className="absolute left-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="py-1">
          {children}
        </div>
      </div>
    )}
  </div>
);

const DropdownItem: React.FC<{
  href: string;
  icon: string;
  brandIcon?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, icon, brandIcon = false, onClick, children }) => (
  <Link
    href={href}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
    onClick={onClick}
  >
    <i className={`${brandIcon ? 'fab' : 'fas'} fa-${icon} mr-3 w-5 text-center`}></i>
    {children}
  </Link>
);

const MobileDropdown: React.FC<{
  title: string;
  icon: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onClick, children }) => (
  <div className="space-y-1">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
    >
      <div className="flex items-center">
        <i className={`fas fa-${icon} mr-3 w-5 text-center`}></i>
        {title}
      </div>
      <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'transform rotate-180' : ''}`}></i>
    </button>
    
    <div className={`pl-8 space-y-1 ${isOpen ? 'block' : 'hidden'}`}>
      {children}
    </div>
  </div>
);

const MobileDropdownItem: React.FC<{
  href: string;
  icon: string;
  brandIcon?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, icon, brandIcon = false, onClick, children }) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
    onClick={onClick}
  >
    <i className={`${brandIcon ? 'fab' : 'fas'} fa-${icon} mr-3 w-5 text-center`}></i>
    {children}
  </Link>
);