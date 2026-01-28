/**
 * @file App.jsx
 * @description Главный компонент приложения, определяющий маршруты
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Pages/Dashboard';
import Coins from './Pages/Coins';
import Banknotes from './Pages/Banknotes';
import Medals from './Pages/Medals';
import Admin from './Pages/Admin';
import Analytics from './Pages/Analytics';
import ActivityHistory from './Pages/ActivityHistory';
import Settings from './Pages/Settings';
import CollectibleDetails from './Pages/CollectibleDetails';

/**
 * Главный компонент приложения
 * @returns {JSX.Element} Основной маршрут приложения
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout currentPageName="Dashboard">
          <Dashboard />
        </Layout>
      } />
      <Route path="/dashboard" element={
        <Layout currentPageName="Dashboard">
          <Dashboard />
        </Layout>
      } />
      <Route path="/coins" element={
        <Layout currentPageName="Coins">
          <Coins />
        </Layout>
      } />
      <Route path="/banknotes" element={
        <Layout currentPageName="Banknotes">
          <Banknotes />
        </Layout>
      } />
      <Route path="/medals" element={
        <Layout currentPageName="Medals">
          <Medals />
        </Layout>
      } />
      <Route path="/admin" element={
        <Layout currentPageName="Admin">
          <Admin />
        </Layout>
      } />
      <Route path="/analytics" element={
        <Layout currentPageName="Analytics">
          <Analytics />
        </Layout>
      } />
      <Route path="/history" element={
        <Layout currentPageName="ActivityHistory">
          <ActivityHistory />
        </Layout>
      } />
      <Route path="/settings" element={
        <Layout currentPageName="Settings">
          <Settings />
        </Layout>
      } />
      <Route path="/collectible-details" element={
        <Layout currentPageName="CollectibleDetails">
          <CollectibleDetails />
        </Layout>
      } />
    </Routes>
  );
}

export default App;