import { useState, useEffect } from 'react';
import { saveBookmark, checkAuth, initiateLogin, verifyCode } from './api';
import { motion } from 'framer-motion';

// Matches any phone number starting with + followed by 1-3 digits country code and 8-12 digits
const PHONE_REGEX = /^\+[1-9]\d{0,2}[1-9]\d{7,11}$/;

function App() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [authState, setAuthState] = useState<'checking' | 'unauthenticated' | 'awaiting-code' | 'authenticated'>('checking');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth().then(authenticated => {
      setAuthState(authenticated ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  const isValidPhone = PHONE_REGEX.test(phone);
  const getPhoneError = () => {
    if (!phone) return null;
    if (!phone.startsWith('+')) return 'Must start with country code (e.g. +46, +1, +44)';
    if (phone.length < 10) return 'Phone number is too short';
    if (phone.length > 15) return 'Phone number is too long';
    if (!isValidPhone) return 'Invalid phone number format';
    return null;
  };

  const phoneError = getPhoneError();

  const handleSave = async () => {
    try {
      setStatus('saving');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url || !tab.title) {
        throw new Error('No active tab');
      }

      await saveBookmark(tab.url, tab.title);
      setStatus('success');

      setTimeout(() => window.close(), 1500);
    } catch (error) {
      console.error('Error saving:', error);
      setStatus('error');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await initiateLogin(phone);
      setAuthState('awaiting-code');
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await verifyCode(phone, code);
      setAuthState('authenticated');
    } catch (err) {
      setError('Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (authState === 'checking') {
    return (
      <div className="p-4 w-80 bg-[var(--color-lightest)]">
        <p className="text-sm text-center text-[var(--color-dark)]">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Show phone input
  if (authState === 'unauthenticated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-80 bg-[var(--color-lightest)] p-4"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent 
            bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-darkest)]">
            Welcome to Pagepin
          </h1>
          <p className="text-xl text-[var(--color-dark)]">
            Enter your phone number to continue
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg 
          border border-[var(--color-light)]/20 hover:shadow-xl transition-all">
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-darkest)]">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+46701234567"
                className="w-full p-4 rounded-lg border border-emerald-100 bg-white/50 
                  text-lg tracking-wide placeholder:text-emerald-600/50
                  text-emerald-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="mt-2 text-sm text-[var(--color-dark)]">
                {phoneError || 'We will send you a verification code via SMS'}
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !isValidPhone}
              className="w-full px-4 py-3 rounded-lg text-lg font-medium
                transition-all duration-200 hover:shadow-lg
                bg-gradient-to-r from-emerald-500 to-emerald-600
                text-white hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Show code input
  if (authState === 'awaiting-code') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-80 bg-[var(--color-lightest)] p-4"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg 
          border border-[var(--color-light)]/20 hover:shadow-xl transition-all">
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-darkest)]">Verification Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="1234"
                maxLength={4}
                className="w-full p-4 rounded-lg border border-emerald-100 bg-white/50 
                  text-center text-3xl tracking-[1em] font-mono placeholder:tracking-normal
                  placeholder:text-emerald-600/50 text-emerald-800
                  focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <p className="mt-2 text-sm text-[var(--color-dark)]">
                Enter the 4-digit code sent to {phone}
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg text-lg font-medium
                transition-all duration-200 hover:shadow-lg
                bg-gradient-to-r from-emerald-500 to-emerald-600
                text-white hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Show save button
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 w-80 bg-[var(--color-lightest)]"
    >
      <button
        onClick={handleSave}
        disabled={status === 'saving'}
        className={`
          w-full p-4 rounded-xl font-medium text-lg
          transition-all duration-300 transform
          ${status === 'idle' ? `
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white hover:opacity-90 hover:shadow-lg
            border border-emerald-100
          ` : status === 'saving' ? 
            'bg-emerald-100 text-emerald-600 cursor-wait' :
            status === 'success' ?
            'bg-emerald-500 text-white' :
            'bg-red-500 text-white'
          }
        `}
      >
        {status === 'idle' && (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            Pin this page
          </span>
        )}
        {status === 'saving' && 'Saving...'}
        {status === 'success' && 'Pinned!'}
        {status === 'error' && 'Error - Try Again'}
      </button>
    </motion.div>
  );
}

export default App;