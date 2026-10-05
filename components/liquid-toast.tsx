'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface LiquidToastProps {
  show: boolean;
  message?: string;
  subMessage?: string;
}

export function LiquidToast({
  show,
  message = 'Đã copy link thành công',
  subMessage = 'Cảm ơn bạn đã sử dụng duvansi!',
}: LiquidToastProps) {
  return (
    <div className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ y: -30, opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 32,
              mass: 0.7,
            }}
            className="liquid-glass-toast pointer-events-auto flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full select-none"
          >
            {/* Pulsing check icon circle */}
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
              <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />
            </div>

            {/* Notification content */}
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs sm:text-[13px] font-semibold text-white/95 tracking-wide leading-tight">
                {message}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">
                {subMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
