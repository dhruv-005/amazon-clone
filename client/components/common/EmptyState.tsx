'use client';

import React, { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📦',
  action,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-10 text-center space-y-3 max-w-md mx-auto my-6">
      <span className="text-4xl block">{icon}</span>
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
