import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Courses', path: '/courses' },
  { name: 'Products', path: '/products' },
  { name: 'Team', path: '/team' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">M</div>
          MukitX
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-sm font-medium hover:text-primary transition-colors',
                location.pathname === link.path ? 'text-primary' : 'text-secondary/70 dark:text-white/70'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={profile?.role === 'admin' ? '/admin' : '/dashboard'} 
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 hover:text-primary transition-colors"
              >
                {profile?.role === 'admin' ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
                Dashboard
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-gradient !py-2 !px-5 text-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-dark-bg border-t dark:border-white/10 p-6 flex flex-col gap-4 lg:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium py-2 border-b dark:border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <Link 
                    to={profile?.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 font-medium flex items-center justify-center gap-2"
                  >
                    {profile?.role === 'admin' ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="w-full text-center py-3 font-medium text-red-500 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 font-medium">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-gradient w-full text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
