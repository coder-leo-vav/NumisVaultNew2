/**
 * @file Dashboard.jsx
 * @description Главная страница приложения с обзором коллекции и статистикой
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Coins, Banknote, Medal, TrendingUp, Plus, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import CollectibleCard from '@/components/collectibles/CollectibleCard';
import { useAppSettings } from '@/components/hooks/useAppSettings';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Страница Dashboard - главная страница приложения
 * @returns {JSX.Element} Главная страница с статистикой и превью коллекции
 */
export default function Dashboard() {
  const { formatPrice } = useAppSettings();

  const { data: collectibles = [], isLoading } = useQuery({
    queryKey: ['collectibles'],
    queryFn: () => base44.entities.Collectible.list('-created_date'),
  });

  const stats = {
    total: collectibles.length,
    coins: collectibles.filter(c => c.type === 'coin').length,
    banknotes: collectibles.filter(c => c.type === 'banknote').length,
    medals: collectibles.filter(c => c.type === 'medal').length,
    totalValue: collectibles.reduce((sum, c) => sum + (c.current_value || 0), 0),
    favorites: collectibles.filter(c => c.is_favorite).length,
  };

  const recentItems = collectibles.slice(0, 4);
  const favoriteItems = collectibles.filter(c => c.is_favorite).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
            Моя коллекция
          </h1>
          <p className="text-[#86868B] mt-1">
            Добро пожаловать! Вот обзор вашей коллекции.
          </p>
        </div>
        <Link to={createPageUrl('Admin')}>
          <Button className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full h-11 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Добавить предмет
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Всего предметов"
              value={stats.total}
              icon={TrendingUp}
            />
            <StatCard
              title="Монеты"
              value={stats.coins}
              icon={Coins}
            />
            <StatCard
              title="Банкноты"
              value={stats.banknotes}
              icon={Banknote}
            />
            <StatCard
              title="Медали"
              value={stats.medals}
              icon={Medal}
            />
          </>
        )}
      </div>

      {/* Value Card */}
      <div className="bg-gradient-to-br from-[#1D1D1F] to-[#2D2D2F] rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-wide">
              Общая стоимость коллекции
            </p>
            <p className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
              {formatPrice(stats.totalValue)}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white/80">{stats.favorites} избранных</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl('Analytics')}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                Аналитика
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Монеты', count: stats.coins, icon: Coins, href: 'Coins', color: 'from-amber-500 to-orange-500' },
          { title: 'Банкноты', count: stats.banknotes, icon: Banknote, href: 'Banknotes', color: 'from-green-500 to-emerald-500' },
          { title: 'Медали', count: stats.medals, icon: Medal, href: 'Medals', color: 'from-blue-500 to-indigo-500' },
        ].map((item) => (
          <Link key={item.title} to={createPageUrl(item.href)}>
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#86868B] text-sm font-medium">{item.title}</p>
                  <p className="text-3xl font-bold text-[#1D1D1F] mt-1">{item.count}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[#0071E3] font-medium text-sm group-hover:gap-3 transition-all">
                Перейти
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Недавно добавленные</h2>
            <Link to={createPageUrl('Admin')} className="text-[#0071E3] text-sm font-medium hover:underline">
              Все предметы
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentItems.map((item) => (
              <CollectibleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favoriteItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1D1D1F]">
              <Star className="w-5 h-5 inline-block mr-2 text-yellow-500 fill-yellow-500" />
              Избранное
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favoriteItems.map((item) => (
              <CollectibleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}