// src/components/ui/Dialog.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd } from 'react-icons/fa';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl max-w-lg w-full"
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-2xl"
            >
              &times;
            </button>
            <div className="flex items-center gap-2 mb-4">
              <FaUserMd className="text-blue-600 dark:text-blue-400 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">แก้ไขข้อมูลหมอ</h2>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DialogContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-4 text-gray-800 dark:text-gray-100">{children}</div>
);

export const DialogHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">{children}</div>
);

export const DialogTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="text-lg font-medium text-gray-700 dark:text-gray-100">{children}</div>
);

export const DialogFooter: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex justify-end gap-3 mt-6">
    {children}
  </div>
);

export default Dialog;