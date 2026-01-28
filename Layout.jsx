/**
 * @file Layout.jsx
 * @description Основной компонент макета приложения с боковой навигацией и адаптивным дизайном
 * @author Vododokhov Aleksey
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Coins, 
  Banknote, 
  Medal, 
  Settings,
  BarChart3,
  History,
  Shield,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Обзор', href: 'Dashboard', icon: LayoutDashboard },
  { name: 'Монеты', href: 'Coins', icon: Coins },
  { name: 'Банкноты', href: 'Banknotes', icon: Banknote },
  { name: 'Медали', href: 'Medals', icon: Medal },
  { type: 'divider' },
  { name: 'Администратор', href: 'Admin', icon: Shield },
  { name: 'Аналитика', href: 'Analytics', icon: BarChart3 },
  { name: 'История', href: 'ActivityHistory', icon: History },
  { name: 'Настройки', href: 'Settings', icon: Settings },
];

/**
 * Компонент Layout - основной макет приложения
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Содержимое страницы
 * @param {string} props.currentPageName - Название текущей страницы
 * @returns {JSX.Element} Компонент макета с навигацией
 */
export default function Layout({ children, currentPageName }) {
  /** @type {[boolean, Function]} Состояние открытия боковой панели */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-40 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-[#1D1D1F]" />
        </button>
        <h1 className="ml-4 font-semibold text-[#1D1D1F]">Коллекция</h1>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50 transition-transform duration-300 ease-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#5856D6] flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#1D1D1F]">Коллекция</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#86868B]" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} className="h-px bg-gray-200 my-3" />;
            }

            const isActive = currentPageName === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={createPageUrl(item.href)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-[#0071E3] text-white shadow-lg shadow-blue-500/25" 
                    : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#86868B]")} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all duration-300",
        "lg:ml-72",
        "pt-16 lg:pt-0"
      )}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}