/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './components/Home.tsx';
import Info from './components/Info.tsx';
import MapQuest from './components/MapQuest.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import Profile from './components/Profile.tsx';
import Registration from './components/Registration.tsx';
import { MissionProvider } from './mission-context/MissionContext.tsx';

export default function App() {
  useEffect(() => {
    const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
    console.log("🚀 App iniciada. URL de Google Sheets:", sheetsUrl ? "Configurada ✅" : "No configurada ❌");
  }, []);

  return (
    <MissionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="info" element={<Info />} />
            <Route path="map" element={<MapQuest />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="register" element={<Registration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MissionProvider>
  );
}

