import React, { createContext, useContext, useState, useEffect } from 'react';

interface StudentData {
  nombre: string;
  apellidos: string;
  edad: string;
  curso: string;
  grupo: string;
}

interface CompanionData {
  nombre: string;
  apellidos: string;
  edad: string;
  relacion: string;
}

interface MissionData {
  student: StudentData | null;
  companion: CompanionData | null;
  startTime: number | null;
  endTime: number | null;
  isActive: boolean;
  elapsedTime: number; // in seconds
  completedTreasures: number[]; // IDs of completed treasures
  totalPoints: number;
  totalTime: number; // cumulative time of all completed missions
}

interface MissionContextType {
  mission: MissionData;
  startMission: (student: StudentData, companion: CompanionData) => void;
  stopMission: (treasureId: number, points: number) => void;
  resumeMission: () => void;
  startNewTreasure: () => void;
  resetMission: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

const STORAGE_KEY = 'treasure_hunt_mission_data';

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [mission, setMission] = useState<MissionData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultData: MissionData = {
      student: null,
      companion: null,
      startTime: null,
      endTime: null,
      isActive: false,
      elapsedTime: 0,
      completedTreasures: [],
      totalPoints: 0,
      totalTime: 0,
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          // Persist active state if it was active
          isActive: parsed.isActive || false,
          startTime: parsed.startTime || null,
          elapsedTime: parsed.elapsedTime || 0,
        };
      } catch (e) {
        console.error("Error parsing saved mission data", e);
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      student: mission.student,
      companion: mission.companion,
      completedTreasures: mission.completedTreasures || [],
      totalPoints: mission.totalPoints || 0,
      totalTime: mission.totalTime || 0,
      elapsedTime: mission.elapsedTime || 0,
      isActive: mission.isActive,
      startTime: mission.startTime,
    }));
  }, [mission]);

  useEffect(() => {
    let interval: any;
    if (mission.isActive && mission.startTime) {
      interval = setInterval(() => {
        setMission(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || Date.now())) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mission.isActive, mission.startTime]);

  const startMission = (student: StudentData, companion: CompanionData) => {
    setMission(prev => ({
      ...prev,
      student,
      companion,
      startTime: Date.now(),
      endTime: null,
      isActive: true,
      elapsedTime: 0,
    }));
  };

  const resumeMission = () => {
    setMission(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now() - (prev.elapsedTime * 1000),
    }));
  };

  const startNewTreasure = () => {
    setMission(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
      elapsedTime: 0,
    }));
  };

  const stopMission = (treasureId: number, points: number) => {
    setMission(prev => {
      const completed = prev.completedTreasures || [];
      if (completed.includes(treasureId)) {
        return { ...prev, isActive: false, endTime: Date.now() };
      }
      
      const newCompleted = [...completed, treasureId];
      return {
        ...prev,
        isActive: false,
        endTime: Date.now(),
        completedTreasures: newCompleted,
        totalPoints: Number(((prev.totalPoints || 0) + points).toFixed(2)),
        totalTime: (prev.totalTime || 0) + prev.elapsedTime,
      };
    });
  };

  const resetMission = () => {
    setMission({
      student: null,
      companion: null,
      startTime: null,
      endTime: null,
      isActive: false,
      elapsedTime: 0,
      completedTreasures: [],
      totalPoints: 0,
      totalTime: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MissionContext.Provider value={{ mission, startMission, stopMission, resumeMission, startNewTreasure, resetMission }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}
