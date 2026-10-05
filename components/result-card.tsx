'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

interface ResultCardProps {
  url: string;
  shortUrl?: string | null;
  onCopySuccess?: () => void;
}

export function ResultCard({ url, shortUrl, onCopySuccess }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const targetLink = shortUrl || url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetLink);
    } catch {
      const el = document.createElement('textarea');
      el.value = targetLink;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setCopied(true);
    if (onCopySuccess) {
      onCopySuccess();
    }
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
      className="w-full mt-4 relative"
    >
      {/* Link + Copy Button + MUA Button trên cùng 1 hàng duy nhất */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Link Box */}
        <button
          onClick={handleCopy}
          type="button"
          className="flex-1 min-w-0 text-left px-4 py-3 rounded-2xl bg-zinc-950/50 hover:bg-zinc-950/70 border border-white/[0.08] hover:border-white/[0.16] text-xs sm:text-[13px] font-mono text-zinc-200 select-all overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer transition-all duration-200"
          title="Bấm để sao chép"
          aria-label="Sao chép link"
        >
          {targetLink}
        </button>

        {/* Nút Copy tròn Icon Only với Animated Checkmark */}
        <div
          onClick={handleCopy}
          className="shrink-0 cursor-pointer select-none"
          role="button"
          title="Sao chép"
          aria-label={copied ? 'Đã copy' : 'Sao chép link'}
        >
          <div className="checkbox-wrapper">
            <input
              id="copy-checkbox-btn"
              type="checkbox"
              checked={copied}
              readOnly
            />
            <label htmlFor="copy-checkbox-btn">
              <Copy className="w-4 h-4 copy-hint-icon stroke-[2]" />
              <div className="tick_mark" />
            </label>
          </div>
        </div>

        {/* Nút MUA Animated Button phong cách độc đáo */}
        <a
          href={targetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-animated-button shrink-0"
          title="Mở mua ngay"
          aria-label="Mở mua ngay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </svg>
          <span className="text">MUA</span>
          <span className="circle" />
          <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
