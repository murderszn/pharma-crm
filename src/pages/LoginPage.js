import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96">
          <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-500/40 via-primary-500/10 to-primary-500/40 blur-3xl opacity-30"></div>
        </div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96">
          <div className="absolute inset-0 rotate-45 translate-x-1/2 translate-y-1/2 bg-gradient-conic from-primary-600/40 via-primary-600/10 to-primary-600/40 blur-3xl opacity-30"></div>
        </div>
      </div>

      <div className="max-w-md w-full mx-4">
        <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center space-y-6 mb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 8.5M12 6V12M12 6L8 8.5M12 12L16 9.5M12 12V18M12 12L8 9.5M12 18L16 15.5M12 18L8 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                AURABLOX
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Your Intelligent Business Suite
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-150 shadow-sm hover:shadow group"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-primary-300 group-hover:text-primary-200 transition duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-600">
              <p>Demo credentials: any username and password will work</p>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} AURABLOX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
} 