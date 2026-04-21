'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { redirect } from 'next/navigation';
import {
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
  Copy,
  Link2,
  Plus,
  Check,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

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

const BASE_DOMAIN = 'https://feedbackpro-ltga.vercel.app';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [establishments, setEstablishments] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [newSector, setNewSector] = useState('');
  const [copiedBase, setCopiedBase] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSector, setCopiedSector] = useState<string | null>(null);

  const enterprise = session?.user?.enterprise || '';

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login');
    if (status === 'authenticated' && enterprise) fetchEstablishments();
  }, [session, status, enterprise]);

  const fetchEstablishments = async () => {
    try {
      const response = await fetch(`/api/establishments/${enterprise}`);
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
    if (average >= 4.5) return 'text-emerald-400';
    if (average >= 3.5) return 'text-blue-400';
    if (average >= 2.5) return 'text-amber-400';
    if (average >= 1.5) return 'text-orange-400';
    return 'text-rose-400';
  };

  const getSatisfactionLabel = (level: number) => {
    if (level >= 4.5) return 'Excelente';
    if (level >= 3.5) return 'Bom';
    if (level >= 2.5) return 'Regular';
    if (level >= 1.5) return 'Ruim';
    return 'Muito Ruim';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 4.0) return 'bg-emerald-500';
    if (score >= 3.0) return 'bg-blue-500';
    if (score >= 2.0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const handleCopyBaseUrl = async () => {
    const baseUrl = `${BASE_DOMAIN}/${enterprise}/`;
    try {
      await navigator.clipboard.writeText(baseUrl);
      setCopiedBase(true);
      toast.success('URL base copiada!');
      setTimeout(() => setCopiedBase(false), 2000);
    } catch {
      toast.error('Erro ao copiar URL');
    }
  };

  const handleGenerateSectorLink = async () => {
    if (!newSector.trim()) {
      toast.warning('Digite um nome para o setor');
      return;
    }
    const sectorSlug = newSector.trim().toLowerCase().replace(/\s+/g, '-');
    const fullUrl = `${BASE_DOMAIN}/${enterprise}/${sectorSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      toast.success('Link do setor copiado!');
      setNewSector('');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  const handleCopySectorUrl = async (sector: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const sectorUrl = `${BASE_DOMAIN}/${enterprise}/${sector}`;
    try {
      await navigator.clipboard.writeText(sectorUrl);
      setCopiedSector(sector);
      toast.success('Link do local copiado!');
      setTimeout(() => setCopiedSector(null), 2000);
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-slate-300 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Toaster position="top-center" theme="dark" toastOptions={{ style: { background: '#1e293b', border: '1px solid #334155' } }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-slate-400" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent leading-tight">Dashboard</h1>
            </div>
            <p className="text-slate-400 text-xl mt-2">
              Bem-vindo, <span className="text-white font-bold">{session?.user?.name}</span>
            </p>
          </div>

          <button
            onClick={() => signOut({ redirectTo: '/login' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </motion.div>

        {/* Link Tools */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Base URL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-medium text-white">URL Base</h3>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm font-mono truncate">
                {BASE_DOMAIN}/{enterprise}/
              </code>
              <button
                onClick={handleCopyBaseUrl}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Copiar URL base"
              >
                {copiedBase ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Use esta URL base para criar links de setores adicionando o nome ao final.
            </p>
          </div>

          {/* Criar Link de Setor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-medium text-white">Criar Link de Novo Local</h3>
            </div>
            <div className="flex flex-wrap items-stretch gap-2">
              <div className="flex-1 min-w-[200px] flex items-stretch bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <span className="inline-flex items-center px-3 py-2 text-slate-500 text-sm font-mono bg-slate-900 border-r border-slate-800">
                  …/{enterprise}/
                </span>
                <input
                  type="text"
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  placeholder="nomedolocal"
                  className="w-full bg-transparent px-3 py-2 text-white placeholder:text-slate-600 text-sm outline-none"
                />
              </div>
              <button
                onClick={handleGenerateSectorLink}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 border border-slate-700 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copiar Link
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Digite o nome do setor e clique para copiar o link completo.
            </p>
          </div>
        </motion.div>

        {/* Overall Satisfaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <Award className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Satisfação Geral</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl md:text-5xl font-semibold ${getSatisfactionColor(overallAverage)}`}>
                      {overallAverage.toFixed(1)}
                    </span>
                    <span className="text-slate-500 text-lg">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(overallAverage)
                              ? 'text-amber-400 fill-amber-400'
                              : i < overallAverage
                              ? 'text-amber-400 fill-amber-400 opacity-60'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${getSatisfactionColor(overallAverage)}`}>
                      {getSatisfactionLabel(overallAverage)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:text-right space-y-3">
                <div className="flex items-center gap-2 lg:justify-end">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">
                    {establishments.reduce((acc, est) => acc + est.total_feedback, 0).toLocaleString()} avaliações totais
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Nível de Satisfação</span>
                    <span className="text-slate-300">{Math.round((overallAverage / 5) * 100)}%</span>
                  </div>
                  <div className="w-full lg:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(overallAverage / 5) * 100}%` }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className={`h-full ${getProgressColor(overallAverage)}`}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  em {establishments.length} estabelecimento{establishments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Establishments List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-slate-400" />
              Seus Estabelecimentos
            </h2>
            <span className="text-sm text-slate-500">{establishments.length} locais</span>
          </div>

          {establishments.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
              <p className="text-slate-400">Nenhum dado disponível ainda</p>
              <p className="text-slate-500 text-sm mt-1">Comece a receber feedback para ver estatísticas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {establishments.map((est, index) => (
                  <motion.div
                    key={est.sector}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <Link href={`/dashboard/establishment/${est.sector}`}>
                      <div className="h-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-colors">
                        {/* Card Header */}
                        <div className="px-5 py-4 border-b border-slate-800">
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium text-white capitalize truncate">
                                  {est.sector}
                                </h3>
                                <button
                                  onClick={(e) => handleCopySectorUrl(est.sector, e)}
                                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                                  title="Copiar URL do local"
                                >
                                  {copiedSector === est.sector ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded-md">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span className={`text-sm font-semibold ${getSatisfactionColor(est.average_satisfaction)}`}>
                                    {est.average_satisfaction.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-slate-600 text-xs">•</span>
                                <span className="text-slate-400 text-xs">
                                  {est.total_feedback} avaliações
                                </span>
                              </div>
                            </div>
                            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                              {est.average_satisfaction >= 4.0 ? (
                                <Laugh className="w-5 h-5 text-emerald-400" />
                              ) : est.average_satisfaction >= 3.0 ? (
                                <Smile className="w-5 h-5 text-blue-400" />
                              ) : est.average_satisfaction >= 2.0 ? (
                                <Meh className="w-5 h-5 text-amber-400" />
                              ) : (
                                <Frown className="w-5 h-5 text-rose-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="px-5 py-4 space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Índice de satisfação</span>
                              <span className="text-slate-300">{Math.round((est.average_satisfaction / 5) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(est.average_satisfaction / 5) * 100}%` }}
                                transition={{ delay: index * 0.05 + 0.1, duration: 0.5 }}
                                className={`h-full ${getProgressColor(est.average_satisfaction)}`}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Distribuição</p>
                            <div className="grid grid-cols-5 gap-1">
                              {[
                                { value: est.very_satisfied, label: '😍', bg: 'bg-emerald-950/50 border-emerald-800/50' },
                                { value: est.satisfied, label: '😊', bg: 'bg-blue-950/50 border-blue-800/50' },
                                { value: est.indifferent, label: '😐', bg: 'bg-amber-950/50 border-amber-800/50' },
                                { value: est.dissatisfied, label: '😟', bg: 'bg-orange-950/50 border-orange-800/50' },
                                { value: est.very_dissatisfied, label: '😠', bg: 'bg-rose-950/50 border-rose-800/50' },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className={`flex flex-col items-center py-2 rounded-md border ${item.bg} text-slate-300`}
                                >
                                  <span className="text-xs font-medium">{item.value}</span>
                                  <span className="text-xs mt-0.5">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Ver análises detalhadas</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
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