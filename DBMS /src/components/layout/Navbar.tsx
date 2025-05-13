import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'organizer':
        return '/organizer';
      case 'team_manager':
        return '/team-manager';
      default:
        return '/participant';
    }
  };

  return (
    <nav className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Trophy className="h-8 w-8 text-white mr-2" />
              <span className="text-white font-bold text-lg md:text-xl">SportEvents India</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-blue-100 px-3 py-2 transition-colors duration-200">
              Home
            </Link>
            {user ? (
              <>
                <Link to={getDashboardLink()} className="text-white hover:text-blue-100 px-3 py-2 transition-colors duration-200">
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    className="flex items-center text-white hover:text-blue-100 px-3 py-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.name || 'Account'} <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transform origin-top-right transition-all duration-200 ease-in-out">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-100 px-3 py-2 transition-colors duration-200">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 transform transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md transition-colors duration-200"
              onClick={closeMenu}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-700 flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;