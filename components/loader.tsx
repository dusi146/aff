import React from 'react';

interface LoaderProps {
  text?: string;
}

export function Loader({ text = 'Đang tạo link affiliate...' }: LoaderProps) {
  return (
    <div className="custom-loader-wrapper">
      <div className="custom-loader" role="status" aria-label="Loading">
        <span />
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-medium text-zinc-300 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
