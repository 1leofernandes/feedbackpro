'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

interface FeedbackFormProps {
  enterprise: string;
  sector: string;
}

interface FeedbackButtonProps {
  level: number;
  label: string;
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  level,
  label,
  emoji,
  isSelected,
  onClick,
}) => {
  const colors = {
    5: { bg: 'from-emerald-500 to-emerald-600', glow: '#059669', name: 'emerald' },
    4: { bg: 'from-lime-500 to-lime-600', glow: '#65a30d', name: 'lime' },
    3: { bg: 'from-yellow-500 to-yellow-600', glow: '#ca8a04', name: 'yellow' },
    2: { bg: 'from-orange-500 to-orange-600', glow: '#ea580c', name: 'orange' },
    1: { bg: 'from-red-500 to-red-600', glow: '#dc2626', name: 'red' },
  } as const;

  const color = colors[level as keyof typeof colors];

  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full h-20 md:h-24 rounded-2xl transition-all duration-300 flex flex-row items-center justify-start gap-4 pl-6 pr-4 font-semibold text-lg cursor-pointer overflow-hidden group`}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      animate={isSelected ? { scale: 1.02, y: -3 } : { scale: 1, y: 0 }}
    >
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color.bg}`}></div>

      {/* Glow effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 15px 0px ${color.glow}40`,
              `0 0 25px 0px ${color.glow}60`,
              `0 0 15px 0px ${color.glow}40`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Ring for selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex-shrink-0"
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-4xl md:text-5xl block">{emoji}</span>
      </motion.div>

      <span className="relative z-10 text-white text-left text-xl md:text-2xl font-bold whitespace-nowrap">
        {label}
      </span>

      {/* Shimmer effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default function FeedbackComponent({ enterprise, sector }: FeedbackFormProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Ordem: Muito Satisfeito primeiro (5), depois 4, 3, 2, Muito Insatisfeito (1) por último
  const feedbackOptions = [
    { level: 5, label: 'Muito Satisfeito', emoji: '😍' },
    { level: 4, label: 'Satisfeito', emoji: '😊' },
    { level: 3, label: 'Indiferente', emoji: '😐' },
    { level: 2, label: 'Insatisfeito', emoji: '😟' },
    { level: 1, label: 'Muito Insatisfeito', emoji: '😠' },
  ];

  const handleSubmit = async () => {
    if (selectedLevel === null) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enterprise,
          sector,
          satisfaction_level: selectedLevel,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSelectedLevel(null);
          setSubmitted(false);
        }, 2300);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setSubmitted(false);
  };

  // botão para tela cheia (estilo quiosquw)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      {/* Animated background */}

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-20 p-2 hover:bg-slate-700/70 backdrop-blur-sm rounded-lg border-none text-slate-600 transition-colors"
        aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Content */}
      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Title Section - mais compacto */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 md:mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent leading-tight">
                  Como foi sua experiência?
                </h1>
                <p className="text-lg md:text-xl text-slate-300 font-light">
                  Sua opinião é muito importante para nós
                </p>
              </motion.div>

              {/* Feedback Buttons - Layout vertical compacto */}
              <motion.div
                className="flex flex-col gap-3 mb-6 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {feedbackOptions.map((option, index) => (
                  <motion.div
                    key={option.level}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.06 }}
                    className="w-full"
                  >
                    <FeedbackButton
                      level={option.level}
                      label={option.label}
                      emoji={option.emoji}
                      isSelected={selectedLevel === option.level}
                      onClick={() => setSelectedLevel(option.level)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Submit Button - mais compacto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleSubmit}
                  disabled={selectedLevel === null || isSubmitting}
                  className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
                    selectedLevel !== null
                      ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  } disabled:opacity-50 flex items-center justify-center gap-2`}
                  whileHover={selectedLevel !== null ? { scale: 1.01, y: -2 } : {}}
                  whileTap={selectedLevel !== null ? { scale: 0.99 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Loader className="w-5 h-5 text-white" />
                      </motion.span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Confirmar Avaliação
                      <motion.span 
                        className="group-hover:translate-x-2 transition-transform" 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center py-8"
            >
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
                      <svg className="w-16 h-16 md:w-20 md:h-20 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                >
                  Muito Obrigado!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-slate-300 mb-6"
                >
                  Sua avaliação foi registrada com sucesso
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center"
                >
                  {/* <motion.button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 border border-white/20 hover:border-cyan-400/50 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Avaliar novamente
                  </motion.button> */}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}