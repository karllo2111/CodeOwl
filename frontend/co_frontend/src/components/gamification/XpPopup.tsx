import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../../stores/uiStore';

export const XpPopup: React.FC = () => {
  const { xpGainAmount } = useUiStore();

  return (
    <AnimatePresence>
      {xpGainAmount !== null && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm font-semibold shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>+{xpGainAmount} XP earned</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
