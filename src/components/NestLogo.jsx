import React from 'react';

export default function NestLogo({ size = "text-xl", className = "", light = false }) {
  return (
    <span className={`font-black tracking-tight ${size} ${light ? 'text-white' : 'text-emerald-800'} ${className}`}>
      Nest<span className="text-emerald-500">.</span>
    </span>
  );
}
