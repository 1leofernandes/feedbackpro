'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  Star,
  Users,
  Award,
  LogOut,
  ChevronRight,
  BarChart3,
  Smile,
  Meh,
  Frown,
  Laugh,
} from 'lucide-react';

interface EstablishmentData {
  sector: string;
  total_feedback: number;
  average_satisfaction: number;
  very_satisfied: number;
  satisfied: number;
  indifferent: number;
  dissatisfied: number;
  very_dissatisfied: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [establishments, setEstablishments] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated' && session?.user?.enterprise) {
      fetchEstablishments();
    }
  }, [session, status]);

  const fetchEstablishments = async () => {
    try {
      const response = await fetch(
        `/api/establishments/${session?.user?.enterprise}`
      );
      const data = await response.json();

      if (response.ok) {
        setEstablishments(data.establishments);
        setOverallAverage(data.overall_average);
      }
    } catch (error) {
      console.error('Error fetching establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSatisfactionColor = (average: number) => {
    if (average >= 4.5) return 'text-green-400';
    if (average >= 3.5) return 'text-blue-400';
    if (average >= 2.5) return 'text-yellow-400';
    if (average >= 1.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSatisfactionLabel = (level: number) => {
    if (level >= 4.5) return 'Excelente';
    if (level >= 3.5) return 'Bom';
    if (level >= 2.5) return 'Regular';
    if (level >= 1.5) return 'Ruim';
    return 'Muito Ruim';
  };

  const getGradientByScore = (score: number): string => {
    if (score >= 4.0) return 'from-green-500 to-emerald-500';
    if (score >= 3.0) return 'from-blue-500 to-cyan-500';
    if (score >= 2.0) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-pink-500';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-20 h-20 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Bem-vindo de volta,{' '}
              <span className="font-semibold text-cyan-300">{session?.user?.name}</span>
            </motion.p>
          </div>

          <motion.button
            onClick={() => signOut({ redirectTo: '/login' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 backdrop-blur-sm rounded-xl transition-all duration-300 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </motion.button>
        </motion.div>

        {/* Overall Satisfaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
            {/* Glow effect on hover */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left side - Icon and Main Stats */}
              <div className="flex items-start gap-6 lg:gap-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                        <Award className="w-12 h-12 text-cyan-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">
                      Satisfação Geral
                    </p>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-5xl md:text-6xl font-black ${getSatisfactionColor(overallAverage)}`}
                      >
                        {overallAverage.toFixed(1)}
                      </motion.span>
                      <span className="text-slate-500 text-xl font-semibold">/ 5.0</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                          >
                            <Star
                              className={`w-4 h-4 transition-all ${
                                i < Math.floor(overallAverage)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : i < overallAverage
                                  ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                  : 'text-slate-600'
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className={`text-sm font-semibold tracking-wide ${getSatisfactionColor(overallAverage)}`}>
                        {getSatisfactionLabel(overallAverage)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300 text-sm font-medium">
                        {establishments.reduce((acc, est) => acc + est.total_feedback, 0).toLocaleString()} avaliações totais
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Progress Bar */}
              <div className="lg:text-right space-y-4 flex-1">
                <p className="text-slate-400 text-sm font-medium">
                  em {establishments.length} estabelecimento{establishments.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Nível de Satisfação</span>
                    <span className="text-cyan-400 font-semibold">
                      {Math.round((overallAverage / 5) * 100)}%
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-white/10"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(overallAverage / 5) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-lg shadow-cyan-500/50"
                    ></motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Establishments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Smile className="w-6 h-6 text-cyan-400" />
              </div>
              Seus Estabelecimentos
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-sm font-medium"
            >
              {establishments.length} local{establishments.length !== 1 ? 'is' : ''}
            </motion.div>
          </div>

          {establishments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
              <p className="text-slate-400 text-lg">Nenhum dado disponível ainda</p>
              <p className="text-slate-500 text-sm mt-2">Comece a receber feedback para ver estatísticas</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {establishments.map((est, index) => (
                  <motion.div
                    key={est.sector}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative"
                  >
                    <Link href={`/dashboard/establishment/${est.sector}`}>
                      {/* Gradient glow on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/10 group-hover:border-cyan-500/30 transition-colors">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-white capitalize mb-2">
                                {est.sector}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                  <span className={`text-base font-bold ${getSatisfactionColor(est.average_satisfaction)}`}>
                                    {est.average_satisfaction.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-slate-500 text-xs">•</span>
                                <span className="text-slate-400 text-xs font-medium">
                                  {est.total_feedback} avalia{est.total_feedback !== 1 ? 'ções' : 'ção'}
                                </span>
                              </div>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                              {est.average_satisfaction >= 4.0 ? (
                                <Laugh className="w-6 h-6 text-emerald-400" />
                              ) : est.average_satisfaction >= 3.0 ? (
                                <Smile className="w-6 h-6 text-cyan-400" />
                              ) : est.average_satisfaction >= 2.0 ? (
                                <Meh className="w-6 h-6 text-yellow-400" />
                              ) : (
                                <Frown className="w-6 h-6 text-red-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5 space-y-5 flex-1">
                          {/* Satisfaction Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400 font-medium">Índice de satisfação</span>
                              <span className="text-cyan-300 font-semibold">
                                {Math.round((est.average_satisfaction / 5) * 100)}%
                              </span>
                            </div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                              className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/10"
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(est.average_satisfaction / 5) * 100}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                className={`h-full bg-gradient-to-r ${getGradientByScore(est.average_satisfaction)} rounded-full shadow-lg`}
                              ></motion.div>
                            </motion.div>
                          </div>

                          {/* Distribution */}
                          <div className="space-y-2">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Distribuição</p>
                            <div className="grid grid-cols-5 gap-1">
                              {[
                                { value: est.very_satisfied, color: 'from-emerald-500 to-emerald-600', label: '😍', bg: 'bg-emerald-500/20' },
                                { value: est.satisfied, color: 'from-cyan-500 to-cyan-600', label: '😊', bg: 'bg-cyan-500/20' },
                                { value: est.indifferent, color: 'from-yellow-500 to-yellow-600', label: '😐', bg: 'bg-yellow-500/20' },
                                { value: est.dissatisfied, color: 'from-orange-500 to-orange-600', label: '😟', bg: 'bg-orange-500/20' },
                                { value: est.very_dissatisfied, color: 'from-red-500 to-red-600', label: '😠', bg: 'bg-red-500/20' },
                              ].map((item, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + i * 0.05 }}
                                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border border-white/10 ${item.bg} hover:border-white/20 transition-all cursor-pointer`}
                                >
                                  <span className="text-xs font-bold text-white">{item.value}</span>
                                  <span className="text-xs mt-0.5">{item.label}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-white/10 group-hover:border-cyan-500/30 transition-colors bg-white/2 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">Ver análises detalhadas</span>
                          <motion.div
                            className="text-cyan-400"
                            whileHover={{ x: 4 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}