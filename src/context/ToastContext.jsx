import React, { createContext, useContext, useState, useEffect } from 'react';
import { WifiOff, AlertTriangle, RefreshCw, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [networkError, setNetworkError] = useState(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showNetworkError = (errorDetail) => {
    setNetworkError(errorDetail || {
      title: 'Network Issue',
      message: 'Unable to connect to the server. Please check your internet connection and try again.'
    });
  };

  const hideNetworkError = () => {
    setNetworkError(null);
  };

  useEffect(() => {
    const handleNetworkEvent = (e) => {
      const detail = e.detail || {};
      showNetworkError({
        title: detail.title || 'Network Issue',
        message: detail.message || 'Unable to connect to the server. Please check your internet connection and try again.'
      });
    };

    window.addEventListener('app-network-error', handleNetworkEvent);
    return () => window.removeEventListener('app-network-error', handleNetworkEvent);
  }, []);

  return (
    <ToastContext.Provider value={{
      addToast,
      showNetworkError,
      hideNetworkError,
      toast: {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        network: (msg) => showNetworkError({ title: 'Network Issue', message: msg }),
      }
    }}>
      {children}

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border text-sm font-medium flex items-center justify-between transition-all duration-300 transform translate-y-0 ${
              t.type === 'success' ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/50 backdrop-blur-md' :
              t.type === 'error' ? 'bg-orange-950/90 text-orange-100 border-orange-700/50 backdrop-blur-md' :
              'bg-slate-900/90 text-slate-100 border-slate-700/50 backdrop-blur-md'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Dedicated Network Issue Modal Popup */}
      {networkError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              onClick={hideNetworkError}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <WifiOff size={32} />
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-2">
              {networkError.title || 'Network Issue'}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {networkError.message || 'Unable to connect to the server. Please check your internet connection and try again.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={hideNetworkError}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  hideNetworkError();
                  window.location.reload();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
