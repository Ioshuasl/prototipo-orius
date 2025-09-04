import React from 'react';
import { X, Info } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-600 leading-relaxed">
          {children}
        </main>
        <footer className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
             <button
                type="button"
                onClick={onClose}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Entendi
            </button>
        </footer>
      </div>
    </div>
  );
}