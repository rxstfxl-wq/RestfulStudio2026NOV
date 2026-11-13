import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { fixImageUrl } from '../utils/imageUtils';

interface AuthorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
}

export const AuthorAuthModal: React.FC<AuthorAuthModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = onLogin(email.trim(), password);
    if (success) {
      setEmail('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid author credentials. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F0F0F] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={fixImageUrl("brand-assets/RXSTFXL LOGO - LANDSCAPE.svg")}
              alt="RXSTFXL Logo"
              referrerPolicy="no-referrer"
              className="h-5 w-auto object-contain"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-bold border-l border-zinc-800 pl-3">
              AUTHOR CONTROL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          /* Active Session View */
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800">
              <CheckCircle className="w-6 h-6 text-[#D72626]" />
              <div>
                <div className="font-mono text-xs text-[#D72626] uppercase font-bold tracking-wider">
                  AUTHENTICATED AUTHOR
                </div>
                <div className="font-mono text-sm text-white font-medium">
                  rxstfxl@gmail.com
                </div>
              </div>
            </div>

            <p className="font-mono text-xs text-zinc-400 leading-relaxed">
              Author status active. You have full permission to hide and unhide portfolio projects directly across the archive grid and case study detail views.
            </p>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="font-mono text-[10px] text-zinc-500 uppercase">
                STATUS: ELEVATED PRIVILEGES
              </span>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 bg-[#D72626] hover:bg-red-700 text-white font-mono text-xs tracking-wider uppercase font-bold flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOG OUT AUTHOR</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                AUTHOR ACCESS
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                Authenticate to manage project visibility and project archival settings.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 text-red-200 font-mono text-xs">
                <AlertCircle className="w-4 h-4 text-[#D72626] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block">
                  AUTHOR EMAIL
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="author@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D72626] px-3.5 py-2.5 font-mono text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block">
                  AUTHOR PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D72626] px-3.5 py-2.5 font-mono text-sm text-white focus:outline-none transition-colors"
                  />
                  <KeyRound className="absolute right-3 top-2.5 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs text-zinc-400 hover:text-white uppercase transition-colors"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#D72626] hover:bg-red-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>AUTHENTICATE</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
