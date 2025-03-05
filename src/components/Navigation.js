import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 8.5M12 6V12M12 6L8 8.5M12 12L16 9.5M12 12V18M12 12L8 9.5M12 18L16 15.5M12 18L8 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">AURABLOX</h1>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-primary-500 hover:border-primary-300'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/visual-playground"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-primary-500 hover:border-primary-300'
                  }`
                }
              >
                Visual Playground
              </NavLink>
              <NavLink
                to="/ai-toybox"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-primary-500 hover:border-primary-300'
                  }`
                }
              >
                AI Toybox
              </NavLink>
              <NavLink
                to="/insights"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-primary-500 hover:border-primary-300'
                  }`
                }
              >
                Insights
              </NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Profile Dropdown */}
            <div className="hidden sm:block relative group">
              <button className="flex items-center space-x-3 group">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  {user?.name}
                </span>
                <svg 
                  className="w-4 h-4 text-gray-400 group-hover:text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-[100] border border-gray-100">
                <div className="py-1">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        isActive ? 'bg-gray-50 text-primary-600' : ''
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </div>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`
              }
              onClick={handleMobileNavClick}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/visual-playground"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`
              }
              onClick={handleMobileNavClick}
            >
              Visual Playground
            </NavLink>
            <NavLink
              to="/ai-toybox"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`
              }
              onClick={handleMobileNavClick}
            >
              AI Toybox
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`
              }
              onClick={handleMobileNavClick}
            >
              Insights
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="space-y-1">
              <div className="px-4 py-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  </div>
                </div>
              </div>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'border-primary-500 text-primary-700 bg-primary-50' 
                      : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                  }`
                }
                onClick={handleMobileNavClick}
              >
                Settings
              </NavLink>
              <button
                onClick={() => {
                  handleMobileNavClick();
                  handleLogout();
                }}
                className="block w-full text-left pl-3 pr-4 py-2.5 border-l-4 text-base font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 