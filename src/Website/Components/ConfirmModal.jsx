import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        
        <p className="mb-6 text-sm text-gray-500 leading-relaxed">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors shadow-sm ${
              isDestructive 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
