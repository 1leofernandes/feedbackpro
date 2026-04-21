'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { ArrowLeft, Star, TrendingUp, Users } from 'lucide-react';

interface FeedbackEntry {
  date: string;
  count: number;
  satisfaction_level: number;
}

interface EstablishmentDetail {
  total_feedback: number;
  average_satisfaction: number;
  very_satisfied: number;
  satisfied: number;
  indifferent: number;
  dissatisfied: number;
  very_dissatisfied: number;
  feedback_by_date: FeedbackEntry[];
}

interface PageProps {
  params: Promise<{
    establishment: string;
  }>;
}

export default function EstablishmentDetailPage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const [establishment, setEstablishment] = useState<EstablishmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [establishmentName, setEstablishmentName] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated') {
      (async () => {
        const p = await params;
        setEstablishmentName(p.establishment);
        fetchEstablishment(p.establishment);
      })();
    }
  }, [status, params]);

  const fetchEstablishment = async (establishment: string) => {
    try {
      const response = await fetch(
        `/api/establishments/${session?.user?.enterprise}/${establishment}`
      );
      const data = await response.json();

      if (response.ok) {
        setEstablishment(data);
      }
    } catch (error) {
      console.error('Error fetching establishment:', error);
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

  const getProgressColor = (score: number): string => {
    if (score >= 4.0) return 'bg-emerald-500';
    if (score >= 3.0) return 'bg-blue-500';
    if (score >= 2.0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-slate-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-slate-400">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white capitalize">
            {establishmentName}
          </h1>
        </motion.div>

        {/* Overall Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Star className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Satisfação Média</p>
            </div>
            <p className={`text-3xl font-semibold ${getSatisfactionColor(establishment.average_satisfaction)}`}>
              {establishment.average_satisfaction.toFixed(1)}
              <span className="text-slate-500 text-lg font-normal ml-1">/5.0</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Users className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Total de Avaliações</p>
            </div>
            <p className="text-3xl font-semibold text-white">
              {establishment.total_feedback.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Muito Satisfeito</p>
            </div>
            <p className="text-3xl font-semibold text-emerald-400">
              {establishment.total_feedback > 0
                ? ((establishment.very_satisfied / establishment.total_feedback) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </motion.div>

        {/* Distribution Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-lg font-medium text-white mb-6">Distribuição de Avaliações</h2>

          <div className="space-y-5">
            {[
              {
                label: 'Muito Satisfeito',
                count: establishment.very_satisfied,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-400',
              },
              {
                label: 'Satisfeito',
                count: establishment.satisfied,
                color: 'bg-blue-500',
                textColor: 'text-blue-400',
              },
              {
                label: 'Indiferente',
                count: establishment.indifferent,
                color: 'bg-amber-500',
                textColor: 'text-amber-400',
              },
              {
                label: 'Insatisfeito',
                count: establishment.dissatisfied,
                color: 'bg-orange-500',
                textColor: 'text-orange-400',
              },
              {
                label: 'Muito Insatisfeito',
                count: establishment.very_dissatisfied,
                color: 'bg-rose-500',
                textColor: 'text-rose-400',
              },
            ].map((item, idx) => {
              const percentage =
                establishment.total_feedback > 0
                  ? (item.count / establishment.total_feedback) * 100
                  : 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-300">{item.label}</span>
                    <span className={`${item.textColor} tabular-nums`}>
                      {item.count} {item.count === 1 ? 'avaliação' : 'avaliações'} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Future: gráfico temporal pode ser adicionado aqui com o mesmo estilo */}
      </div>
    </div>
  );
}