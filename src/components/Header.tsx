import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          CoachIA
        </Link>
        
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/calculator" className="hover:text-blue-600">
            Calculateur
          </Link>
          <button 
            onClick={() => {/* TODO: Implémenter la déconnexion */}}
            className="hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
} 