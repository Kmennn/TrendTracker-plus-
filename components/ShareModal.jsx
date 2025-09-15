import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import Button from './Button';

const ShareModal = ({ isOpen, onClose, trendId }) => {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/trend/${trendId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 rounded-xl w-full max-w-md shadow-lg border border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Share Trend</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">Share this trend with others:</p>
              <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    readOnly 
                    value={url} 
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-300 focus:ring-purple-500 focus:border-purple-500"
                />
                <Button variant="solid" onClick={handleCopy} className="w-24">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
