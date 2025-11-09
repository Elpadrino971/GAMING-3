'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, languages } from '@/i18n/translations';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages[language];

  return (
    <div className="relative">
      {/* Language Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition shadow-lg"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="font-semibold hidden sm:inline">{currentLanguage.name}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 min-w-[200px]"
            >
              <div className="max-h-[400px] overflow-y-auto">
                {(Object.keys(languages) as Language[]).map((lang) => (
                  <motion.button
                    key={lang}
                    whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                    onClick={() => {
                      setLanguage(lang);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition ${
                      language === lang
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{languages[lang].flag}</span>
                    <span className="font-semibold">{languages[lang].name}</span>
                    {language === lang && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-yellow-400"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
