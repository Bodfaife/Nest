import React from 'react';

export default function ProgressBar({ current, target, color }) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
      <div className={`h-full ${color} transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }} />
    </div>
  );
}
