'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink } from 'lucide-react';

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
      {/* Link + Copy Button trên cùng 1 hàng duy nhất (Icon Only, không có chữ thừa) */}
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

        {/* Nút Copy tròn Icon Only với Animated Checkmark (không cần text) */}
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

        {/* Nút mở liên kết ngoài nhỏ gọn */}
        <a
          href={targetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2.5 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          title="Mở link"
          aria-label="Mở link"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
