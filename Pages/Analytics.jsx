/**
 * @file Analytics.jsx
 * @description Страница аналитики с графиками и статистикой по коллекции
 * @author Vododokhov Aleksey
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAppSettings } from '@/components/hooks/useAppSettings';
import StatCard from '@/components/StatCard';
import { 
  Coins, 
  Banknote, 
  Medal, 
  TrendingUp, 
  Globe, 
  Calendar,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const COLORS = ['#0071E3', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6'];

/**
 * Страница аналитики
 * @returns {JSX.Element} Страница с диаграммами и отчетами по коллекции
 */
export default function AnalyticsPage() {
  const { formatPrice, settings } = useAppSettings();

  const { data: collectibles = [], isLoading } = useQuery({
    queryKey: ['collectibles'],
    queryFn: () => base44.entities.Collectible.list('-created_date'),
  });

  const stats = useMemo(() => {
    const byType = {
      coin: collectibles.filter(c => c.type === 'coin'),
      banknote: collectibles.filter(c => c.type === 'banknote'),
      medal: collectibles.filter(c => c.type === 'medal')
    };

    const totalValue = collectibles.reduce((sum, c) => sum + (c.current_value || 0), 0);
    const totalPurchase = collectibles.reduce((sum, c) => sum + (c.purchase_price || 0), 0);

    // By country
    const byCountry = {};
    collectibles.forEach(c => {
      if (c.country) {
        byCountry[c.country] = (byCountry[c.country] || 0) + 1;
      }
    });
    const countryData = Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // By condition
    const byCondition = {};
    collectibles.forEach(c => {
      if (c.condition) {
        byCondition[c.condition] = (byCondition[c.condition] || 0) + 1;
      }
    });
    const conditionData = Object.entries(byCondition)
      .map(([name, value]) => ({ name, value }));

    // By year (decades)
    const byDecade = {};
    collectibles.forEach(c => {
      if (c.year) {
        const decade = Math.floor(c.year / 10) * 10;
        byDecade[decade] = (byDecade[decade] || 0) + 1;
      }
    });
    const decadeData = Object.entries(byDecade)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([name, value]) => ({ name: `${name}s`, value }));

    // Monthly additions (last 12 months)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('ru-RU', { month: 'short' });
      const count = collectibles.filter(c => {
        const created = new Date(c.created_date);
        return created.getMonth() === date.getMonth() && 
               created.getFullYear() === date.getFullYear();
      }).length;
      monthlyData.push({ name: monthStr, count });
    }

    // Type distribution for pie chart
    const typeData = [
      { name: 'Монеты', value: byType.coin.length, color: '#FF9500' },
      { name: 'Банкноты', value: byType.banknote.length, color: '#34C759' },
      { name: 'Медали', value: byType.medal.length, color: '#0071E3' }
    ].filter(d => d.value > 0);

    // Value by type
    const valueByType = [
      { 
        name: 'Монеты', 
        value: byType.coin.reduce((sum, c) => sum + (c.current_value || 0), 0) 
      },
      { 
        name: 'Банкноты', 
        value: byType.banknote.reduce((sum, c) => sum + (c.current_value || 0), 0) 
      },
      { 
        name: 'Медали', 
        value: byType.medal.reduce((sum, c) => sum + (c.current_value || 0), 0) 
      }
    ];

    return {
      total: collectibles.length,
      coins: byType.coin.length,
      banknotes: byType.banknote.length,
      medals: byType.medal.length,
      totalValue,
      totalPurchase,
      profit: totalValue - totalPurchase,
      favorites: collectibles.filter(c => c.is_favorite).length,
      countries: Object.keys(byCountry).length,
      countryData,
      conditionData,
      decadeData,
      monthlyData,
      typeData,
      valueByType
    };
  }, [collectibles]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-[#0071E3]">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
          Аналитика
        </h1>
        <p className="text-[#86868B] mt-1">
          Статистика и отчёты по вашей коллекции
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего предметов"
          value={stats.total}
          icon={TrendingUp}
        />
        <StatCard
          title="Общая стоимость"
          value={formatPrice(stats.totalValue)}
          icon={Coins}
        />
        <StatCard
          title="Стран"
          value={stats.countries}
          icon={Globe}
        />
        <StatCard
          title="Избранных"
          value={stats.favorites}
          icon={Star}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            Распределение по типам
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Additions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            Добавления по месяцам
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0071E3" 
                  strokeWidth={2}
                  dot={{ fill: '#0071E3' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Country */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            Топ стран
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0071E3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Condition */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            По состоянию
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.conditionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#34C759" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Decade */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            По десятилетиям
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.decadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#FF9500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Value Summary */}
      <div className="bg-gradient-to-br from-[#1D1D1F] to-[#2D2D2F] rounded-3xl p-8 text-white">
        <h3 className="text-xl font-semibold mb-6">Финансовая сводка</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/60 text-sm">Общая стоимость</p>
            <p className="text-3xl font-bold mt-1">{formatPrice(stats.totalValue)}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Потрачено на покупки</p>
            <p className="text-3xl font-bold mt-1">{formatPrice(stats.totalPurchase)}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Прибыль/убыток</p>
            <p className={`text-3xl font-bold mt-1 ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.profit >= 0 ? '+' : ''}{formatPrice(stats.profit)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}