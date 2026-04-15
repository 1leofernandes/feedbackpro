'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';

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
  const [establishment, setEstablishment] = useState<EstablishmentDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [establishment_name, setEstablishment_name] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated') {
      (async () => {
        const p = await params;
        setEstablishment_name(p.establishment);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <p className="text-center text-gray-600">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/dashboard"
          className="text-blue-600 font-semibold mb-4 inline-block hover:underline"
        >
          ← Voltar ao Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 capitalize">
          {establishment_name}
        </h1>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Satisfação Média</p>
          <p className="text-4xl font-bold text-blue-600">
            {establishment.average_satisfaction.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Total de Avaliações</p>
          <p className="text-4xl font-bold text-purple-600">
            {establishment.total_feedback}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-2">Taxa de Muito Satisfeito</p>
          <p className="text-4xl font-bold text-green-600">
            {establishment.total_feedback > 0
              ? (
                  (establishment.very_satisfied / establishment.total_feedback) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </motion.div>

      {/* Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Distribuição de Avaliações
        </h2>
        <div className="space-y-4">
          {[
            {
              label: 'Muito Insatisfeito',
              count: establishment.very_dissatisfied,
              color: 'bg-red-500',
            },
            {
              label: 'Insatisfeito',
              count: establishment.dissatisfied,
              color: 'bg-orange-500',
            },
            {
              label: 'Indiferente',
              count: establishment.indifferent,
              color: 'bg-yellow-500',
            },
            {
              label: 'Satisfeito',
              count: establishment.satisfied,
              color: 'bg-blue-500',
            },
            {
              label: 'Muito Satisfeito',
              count: establishment.very_satisfied,
              color: 'bg-green-500',
            },
          ].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>
              <div className="flex items-center gap-4">
                <span className="w-40 text-sm font-semibold text-gray-700">
                  {item.label}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className={`${item.color} h-full flex items-center justify-end pr-3 transition-all`}
                    style={{
                      width: `${
                        establishment.total_feedback > 0
                          ? (item.count / establishment.total_feedback) * 100
                          : 0
                      }%`,
                    }}
                  >
                    {establishment.total_feedback > 0 && (
                      <span className="text-white text-xs font-bold">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-semibold text-gray-700">
                  {establishment.total_feedback > 0
                    ? (
                        (item.count / establishment.total_feedback) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
