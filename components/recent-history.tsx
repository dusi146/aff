'use client';

import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { RecentHistoryItem } from '@/lib/types';

interface RecentHistoryProps {
  items: RecentHistoryItem[];
  onClear: () => void;
  onCopySuccess?: () => void;
}

export function RecentHistory({ items, onClear, onCopySuccess }: RecentHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setCopiedId(id);
    if (onCopySuccess) {
      onCopySuccess();
    }
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full mt-6 pt-5 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
          Gần đây
        </span>
        <button
          onClick={onClear}
          type="button"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
          title="Xóa lịch sử"
        >
          <Trash2 className="w-3 h-3" />
          <span>Xóa</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-950/70 border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <span className="text-xs font-mono text-zinc-400 truncate flex-1 min-w-0">
                {item.displayUrl}
              </span>

              <button
                onClick={() => handleCopy(item.id, item.affiliateUrl)}
                type="button"
                className={`p-1.5 rounded-lg text-xs transition-colors shrink-0 ${
                  isCopied
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
                title={isCopied ? 'Đã copy' : 'Sao chép'}
                aria-label={isCopied ? 'Đã copy' : 'Sao chép'}
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
