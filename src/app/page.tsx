'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Users, MessageCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16 lg:mb-20">
            <motion.div
              className="flex items-center justify-center mb-6 gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Bem-vindo ao</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent leading-tight">
              FeedbackPro
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light tracking-wide">
              Plataforma de Avaliação de Satisfação do Cliente
            </p>
            <p className="text-slate-400 text-sm md:text-base mb-12 max-w-2xl mx-auto leading-relaxed">
              Colete feedback em tempo real, analise dados com precisão e otimize a experiência do seu cliente através de insights poderosos.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 lg:mb-20"
          >
            {[
              {
                icon: MessageCircle,
                title: 'Feedback Anônimo',
                desc: 'Coleta de avaliações sem identificação do cliente',
              },
              {
                icon: BarChart3,
                title: 'Análise em Tempo Real',
                desc: 'Visualize tendências e métricas instantaneamente',
              },
              {
                icon: Users,
                title: 'Multi-Estabelecimentos',
                desc: 'Gerencie múltiplos locais em um único painel',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 lg:mb-20"
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Painel do Gestor
                </span>
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 md:px-10 md:py-5 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-white font-bold rounded-xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Criar Conta
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Code Block */}
          <motion.div variants={itemVariants} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <p className="text-slate-300 text-sm md:text-base mb-4 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Para acessar o kiosk de feedback:
            </p>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-cyan-500/20 overflow-x-auto">
              <code className="text-cyan-300 font-mono text-xs md:text-sm break-all">
                {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:{typeof window !== 'undefined' ? window.location.port : '3000'}/[enterprise]/[sector]
              </code>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

