import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  isVisible: boolean;
  message?: string;
}

export function GlobalLoader({ isVisible, message = 'Atualizando dados da paróquia...' }: GlobalLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md mx-4 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Alternando Paróquia
            </h3>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
