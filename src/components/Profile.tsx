import React from 'react';
import { motion } from 'motion/react';
import { User, Settings, Award, Calendar, MapPin, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMission } from '../context/MissionContext';

const COLORS = ['#5A5A40', '#E4E3E0'];

export default function Profile() {
  const { mission, resetMission } = useMission();
  const [activeTab, setActiveTab] = React.useState('logros');
  
  const completedCount = mission.completedTreasures.length;
  const progressPercent = Math.round((completedCount / 3) * 100);
  
  const progressData = [
    { name: 'Completado', value: progressPercent },
    { name: 'Pendiente', value: 100 - progressPercent },
  ];

  const getLevel = () => {
    if (completedCount === 0) return "Aspirante";
    if (completedCount === 1) return "Novato";
    if (completedCount === 2) return "Explorador";
    return "Maestro Buscador de Tesoros";
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar / User Info */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-[#5A5A40] flex items-center justify-center text-white text-4xl font-serif italic border-4 border-[#F5F5F0]">
                {mission.student?.nombre?.[0] || 'U'}{mission.student?.apellidos?.[0] || 'S'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-[#1A1A1A]/5">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-serif italic">{mission.student ? `${mission.student.nombre} ${mission.student.apellidos}` : 'Usuario Invitado'}</h2>
              <p className="text-sm text-[#1A1A1A]/40 font-semibold uppercase tracking-widest">{mission.student ? `${mission.student.curso} - Grupo ${mission.student.grupo}` : 'Sin Registro'}</p>
            </div>
            <div className="pt-6 border-t border-[#1A1A1A]/5 flex justify-around">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Nivel</p>
                <p className="font-mono font-bold">{getLevel()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tesoros</p>
                <p className="font-mono font-bold">{completedCount}/3</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'logros', icon: Award, label: "Mis Logros" },
              { id: 'actividad', icon: Calendar, label: "Actividad Reciente" },
              { id: 'favoritos', icon: MapPin, label: "Tesoros Favoritos" },
              { id: 'reset', icon: LogOut, label: "Reiniciar Progreso", danger: true, onClick: () => {
                if (window.confirm("¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
                  resetMission();
                }
              }},
            ].map((item, i) => (
              <button 
                key={i}
                onClick={item.onClick || (() => setActiveTab(item.id))}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left",
                  activeTab === item.id ? "bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" : "hover:bg-white text-[#1A1A1A]/60",
                  item.danger && "text-red-500 hover:bg-red-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {activeTab === 'logros' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress Card */}
                <div className="bg-white p-8 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm space-y-6">
                  <h3 className="text-xl font-serif italic">Progreso del Trimestre</h3>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-mono font-bold">{completedCount}/3</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tesoros</span>
                    </div>
                  </div>
                  <p className="text-sm text-center text-[#1A1A1A]/60 italic">
                    {completedCount === 3 ? "¡Enhorabuena! Has completado el desafío." : "Te falta poco para alcanzar el siguiente nivel de nota."}
                  </p>
                </div>

                {/* Stats Card */}
                <div className="bg-[#151619] text-white p-8 rounded-[40px] space-y-8">
                  <h3 className="text-xl font-serif italic">Estadísticas Reales</h3>
                  <div className="space-y-6">
                    {[
                      { label: "Tiempo de Búsqueda", value: formatTime(mission.totalTime) },
                      { label: "Puntos Totales", value: `+${mission.totalPoints.toFixed(2)} pts` },
                      { label: "Tesoros Encontrados", value: completedCount.toString() },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/10 pb-2">
                        <span className="text-xs uppercase tracking-widest font-bold opacity-40">{stat.label}</span>
                        <span className="font-mono font-bold text-lg">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif italic">Logros Desbloqueados</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Primer Paso", icon: "👣", unlocked: completedCount >= 1 },
                    { label: "Explorador", icon: "🧭", unlocked: completedCount >= 2 },
                    { label: "Maestro", icon: "🎓", unlocked: completedCount === 3 },
                    { label: "Cronos", icon: "⏱️", unlocked: mission.totalTime > 0 && mission.totalTime < 3600 },
                  ].map((ach, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "p-6 rounded-3xl border text-center space-y-3 transition-all",
                        ach.unlocked ? "bg-white border-[#1A1A1A]/5 shadow-sm" : "bg-[#F5F5F0] border-dashed border-[#1A1A1A]/10 opacity-40"
                      )}
                    >
                      <span className="text-3xl block">{ach.icon}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold block">{ach.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'actividad' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif italic">Actividad Reciente</h3>
              <div className="space-y-4">
                {mission.completedTreasures.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-[40px] border border-[#1A1A1A]/5 border-dashed">
                    <p className="text-[#1A1A1A]/40 italic">Aún no has completado ninguna misión.</p>
                  </div>
                ) : (
                  mission.completedTreasures.map((id, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/5 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#F5F5F0] flex items-center justify-center text-[#5A5A40]">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-serif italic text-lg">Misión #{id} Completada</h4>
                          <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest font-bold">Registro de éxito</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-[#5A5A40]">Completado</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Estado</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'favoritos' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-serif italic">Tesoros Favoritos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.completedTreasures.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-white rounded-[40px] border border-[#1A1A1A]/5 border-dashed">
                    <p className="text-[#1A1A1A]/40 italic">Encuentra tesoros para marcarlos como favoritos.</p>
                  </div>
                ) : (
                  mission.completedTreasures.map((id, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-mono font-bold">
                          {id}
                        </div>
                        <div className="text-[#5A5A40]">
                          <MapPin className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                      <h4 className="font-serif italic text-lg">Tesoro de Salamanca #{id}</h4>
                      <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">Este tesoro ha sido localizado y registrado en tu historial de explorador.</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
