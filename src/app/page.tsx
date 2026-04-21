'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Users, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';

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
  const router = useRouter();
  const [routeInput, setRouteInput] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeInput.trim()) return;
    
    setIsNavigating(true);
    // Remove espaços extras e barras no início/fim
    let cleanRoute = routeInput.trim().replace(/^\/+|\/+$/g, '');
    // Substitui múltiplas barras por uma única
    cleanRoute = cleanRoute.replace(/\/+/g, '/');
    
    // Redireciona para a URL completa
    window.location.href = `https://feedbackpro-ltga.vercel.app/${cleanRoute}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Animated background elements - mantidos mais sutis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Bem-vindo ao</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent leading-tight tracking-tight">
              FeedbackPro
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
              Plataforma de Avaliação de Satisfação do Cliente
            </p>
            <p className="text-slate-400 text-sm md:text-base mb-12 max-w-2xl mx-auto">
              Colete feedback em tempo real, analise dados com precisão e otimize a experiência do seu cliente.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 lg:mb-20"
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
                  whileHover={{ y: -3 }}
                  className="group"
                >
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700">
                    <Icon className="w-8 h-8 text-slate-400 mb-4" />
                    <h3 className="text-base font-medium text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Painel do Gestor
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-transparent hover:bg-slate-900 text-white font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Criar Conta
              </motion.button>
            </Link>
          </motion.div>

          {/* Access Route Input */}
          <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <p className="text-slate-300 text-sm md:text-base mb-4 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              Acessar página de feedback
            </p>
            
            <form onSubmit={handleNavigate} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  <span className="hidden sm:inline-block px-3 py-2.5 text-slate-500 text-sm bg-slate-900 border-r border-slate-800 font-mono">
                    feedbackpro-ltga.vercel.app/
                  </span>
                  <input
                    type="text"
                    value={routeInput}
                    onChange={(e) => setRouteInput(e.target.value)}
                    placeholder="leoenterprise/loja1"
                    className="w-full bg-transparent px-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none font-mono"
                    disabled={isNavigating}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!routeInput.trim() || isNavigating}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-medium rounded-lg border border-slate-700 disabled:border-slate-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isNavigating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                      Acessando...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Acessar
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Exemplo: digite <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">empresa/setor</code> para abrir a página de feedback
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}