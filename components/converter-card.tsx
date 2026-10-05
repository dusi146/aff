'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, AlertCircle } from 'lucide-react';
import { ResultCard } from './result-card';
import { RecentHistory } from './recent-history';
import { Loader } from './loader';
import { LiquidToast } from './liquid-toast';
import { ConvertApiResponse, RecentHistoryItem } from '@/lib/types';

const MAX_HISTORY = 5;
const STORAGE_KEY = 'duvansi_recent_conversions';

export function ConverterCard() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    shortUrl: string | null;
  } | null>(null);
  const [history, setHistory] = useState<RecentHistoryItem[]>([]);
  const [hasClipboardSupport, setHasClipboardSupport] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load history từ localStorage & check Clipboard API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch {
        // Ignored
      }

      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        setHasClipboardSupport(true);
      }
    }
  }, []);

  const triggerToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  const saveToHistory = (original: string, finalUrl: string, short: string | null) => {
    try {
      const display = short || finalUrl;
      const newItem: RecentHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        originalUrl: original,
        affiliateUrl: display,
        displayUrl: display,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...history.filter((h) => h.affiliateUrl !== display)].slice(
        0,
        MAX_HISTORY
      );
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setErrorMessage(null);
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setErrorMessage('Vui lòng nhập link Shopee');
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data: ConvertApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.success ? 'Có lỗi xảy ra. Thử lại.' : data.error);
        setResult(null);
      } else {
        setResult({
          url: data.url,
          shortUrl: data.shortUrl,
        });
        saveToHistory(trimmedUrl, data.url, data.shortUrl);
      }
    } catch {
      setErrorMessage('Không thể kết nối. Thử lại.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Liquid Glass App Notification floating at top */}
      <LiquidToast
        show={showToast}
        message="Đã copy liên kết"
        subMessage="Cảm ơn bạn đã sử dụng duvansi!"
      />

      <div className="w-full max-w-lg mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
        {/* Main Glass Container - Siêu mờ, sạch bóng text thừa */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-5 sm:p-7 rounded-[28px] glass-panel relative"
        >
          <form onSubmit={handleConvert} className="w-full space-y-4">
            {/* Input Container */}
            <div className="relative w-full">
              <div
                className={`relative flex items-center rounded-2xl glass-input transition-colors duration-200 ${
                  errorMessage ? 'border-red-500/40 focus-within:border-red-500/60' : ''
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Dán link Shopee..."
                  disabled={isLoading}
                  aria-label="Dán link Shopee"
                  className="w-full bg-transparent px-4 sm:px-5 py-4 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none disabled:opacity-50"
                />

                {/* Paste Button */}
                {hasClipboardSupport && (
                  <div className="pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={handlePaste}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] active:scale-95 transition-all select-none"
                      aria-label="Dán link từ clipboard"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Dán</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 mt-2 px-1 text-xs text-rose-400"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Button: Custom Styled Convert Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="custom-convert-btn"
              aria-label="Chuyển đổi link Shopee"
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>{isLoading ? 'Đang tạo link...' : 'Chuyển đổi'}</span>
            </button>
          </form>

          {/* Loading Neon Loader */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Loader text="Đang tạo link affiliate..." />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Area */}
          <AnimatePresence mode="wait">
            {result && !isLoading && (
              <ResultCard
                key={result.shortUrl || result.url}
                url={result.url}
                shortUrl={result.shortUrl}
                onCopySuccess={triggerToast}
              />
            )}
          </AnimatePresence>

          {/* Recent History */}
          <RecentHistory
            items={history}
            onClear={handleClearHistory}
            onCopySuccess={triggerToast}
          />
        </motion.div>
      </div>
    </>
  );
}
