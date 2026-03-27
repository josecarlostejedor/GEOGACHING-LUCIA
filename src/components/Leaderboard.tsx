import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useMission } from '@/src/context/MissionContext';

const MOCK_STUDENTS = [
  { name: "Lucía García", points: 0.65, treasures: 3, trend: "up" },
  { name: "Marcos Ruiz", points: 0.50, treasures: 2, trend: "up" },
  { name: "Elena Martínez", points: 0.45, treasures: 2, trend: "down" },
  { name: "David Sánchez", points: 0.40, treasures: 2, trend: "stable" },
  { name: "Sofía López", points: 0.25, treasures: 1, trend: "up" },
  { name: "Javier Pérez", points: 0.20, treasures: 1, trend: "stable" },
  { name: "Carmen Ortiz", points: 0.20, treasures: 1, trend: "down" },
  { name: "Pablo Torres", points: 0.15, treasures: 1, trend: "up" },
];

export default function Leaderboard() {
  const { mission } = useMission();
  
  // Combine mock data with real user data
  const allStudents = [...MOCK_STUDENTS];
  
  if (mission.student) {
    const userName = `${mission.student.nombre} ${mission.student.apellidos}`;
    // Check if user is already in mock (for demo purposes) or add them
    const existingIndex = allStudents.findIndex(s => s.name === userName);
    if (existingIndex === -1) {
      allStudents.push({
        name: userName,
        points: mission.totalPoints,
        treasures: mission.completedTreasures.length,
        trend: "up"
      });
    } else {
      allStudents[existingIndex].points = mission.totalPoints;
      allStudents[existingIndex].treasures = mission.completedTreasures.length;
    }
  }

  // Sort by points (desc) then treasures (desc)
  const sortedStudents = allStudents
    .sort((a, b) => b.points - a.points || b.treasures - a.treasures)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const top3 = sortedStudents.slice(0, 3);
  const rest = sortedStudents.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-2xl text-[#5A5A40] mb-2">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-serif italic">Ranking de Exploradores</h1>
        <p className="text-[#1A1A1A]/60">IES Lucía de Medrano - 1º Bachillerato A/B</p>
      </header>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-8 border-b border-[#1A1A1A]/10">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="order-2 md:order-1 space-y-4 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                <div className="w-full h-full bg-[#5A5A40]/20 flex items-center justify-center text-[#5A5A40] font-serif italic text-xl">
                  {top3[1].name[0]}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-mono font-bold shadow-sm">2</span>
            </div>
            <div>
              <h3 className="font-serif italic text-xl">{top3[1].name}</h3>
              <p className="text-[#5A5A40] font-mono font-bold">+{top3[1].points.toFixed(2)} pts</p>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="order-1 md:order-2 space-y-6 text-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="relative inline-block"
            >
              <div className="w-32 h-32 rounded-full bg-yellow-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                <div className="w-full h-full bg-yellow-500/20 flex items-center justify-center text-yellow-700 font-serif italic text-3xl">
                  {top3[0].name[0]}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center font-mono font-bold shadow-md text-lg">1</span>
            </motion.div>
            <div>
              <h3 className="font-serif italic text-2xl">{top3[0].name}</h3>
              <p className="text-[#5A5A40] font-mono font-bold text-xl">+{top3[0].points.toFixed(2)} pts</p>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="order-3 space-y-4 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-orange-700 font-serif italic text-xl">
                  {top3[2].name[0]}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-mono font-bold shadow-sm">3</span>
            </div>
            <div>
              <h3 className="font-serif italic text-xl">{top3[2].name}</h3>
              <p className="text-[#5A5A40] font-mono font-bold">+{top3[2].points.toFixed(2)} pts</p>
            </div>
          </div>
        )}
      </div>

      {/* Full List */}
      <div className="bg-white rounded-[40px] border border-[#1A1A1A]/5 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 p-6 bg-[#F5F5F0] text-[10px] uppercase tracking-widest font-bold opacity-40">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-5">Estudiante</div>
          <div className="col-span-2 text-center">Tesoros</div>
          <div className="col-span-2 text-center">Tendencia</div>
          <div className="col-span-2 text-right">Puntos</div>
        </div>
        
        <div className="divide-y divide-[#1A1A1A]/5">
          {sortedStudents.map((s) => (
            <div 
              key={s.rank} 
              className={cn(
                "grid grid-cols-12 p-6 items-center hover:bg-[#F5F5F0]/50 transition-colors",
                mission.student && s.name === `${mission.student.nombre} ${mission.student.apellidos}` && "bg-[#5A5A40]/5"
              )}
            >
              <div className="col-span-1 text-center font-mono font-bold opacity-40">{s.rank}</div>
              <div className="col-span-5 font-serif italic text-lg flex items-center gap-3">
                {s.name}
                {mission.student && s.name === `${mission.student.nombre} ${mission.student.apellidos}` && (
                  <span className="text-[8px] bg-[#5A5A40] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter not-italic">Tú</span>
                )}
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={cn(
                      "w-2 h-2 rounded-full",
                      i < s.treasures ? "bg-[#5A5A40]" : "bg-gray-200"
                    )} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                {s.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-500" /> :
                 s.trend === "down" ? <ArrowDown className="w-4 h-4 text-red-500" /> :
                 <Minus className="w-4 h-4 text-gray-400" />}
              </div>
              <div className="col-span-2 text-right font-mono font-bold text-[#5A5A40]">+{s.points.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
