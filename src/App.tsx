/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/src/components/Layout.tsx';
import Home from '@/src/components/Home.tsx';
import Info from '@/src/components/Info.tsx';
import MapQuest from '@/src/components/MapQuest.tsx';
import Leaderboard from '@/src/components/Leaderboard.tsx';
import Profile from '@/src/components/Profile.tsx';
import Registration from '@/src/components/Registration.tsx';
import { MissionProvider } from '@/src/context/MissionContext.tsx';

export default function App() {
  useEffect(() => {
    const sheetsUrl = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;
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

