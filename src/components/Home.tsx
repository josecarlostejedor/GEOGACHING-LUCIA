import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, ArrowRight, ShieldCheck, History, BookOpen, Trophy, Landmark, Radio, Globe, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useMission } from '../context/MissionContext';

export default function Home() {
  const navigate = useNavigate();
  const { mission, resetMission } = useMission();

  const handleStartSearch = () => {
    resetMission();
    navigate('/register');
  };

  const handleContinueSearch = () => {
    navigate('/map');
  };
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[70vh] rounded-[48px] overflow-hidden bg-[#151619] flex flex-col items-center text-center border border-white/5">
        {/* Top Logo Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white py-12 md:py-16 px-6 flex justify-center items-center relative z-20 shadow-lg border-b border-[#5A5A40]/10"
        >
          <div className="max-w-2xl w-full">
            <img 
              src="https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/geocachinginicio.jpg" 
              alt="Logo Búsqueda de Tesoros" 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1542736667-069246bdbc6d?q=80&w=2070&auto=format&fit=crop" 
            alt="Forest path" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#151619]/90 via-[#151619]/60 to-[#151619]" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-12 flex flex-col items-center py-16 md:py-24 px-8 md:px-12">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-6 py-2 bg-[#5A5A40] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.3em]">
                Proyecto 3er Trimestre
              </span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-8xl font-serif italic text-white leading-[1.1] tracking-normal px-2"
              >
                Búsqueda de Tesoros <br /> 
                <span className="text-[#5A5A40] not-italic font-sans font-bold uppercase text-3xl md:text-5xl block mt-8 tracking-[0.4em]">IES Lucía de Medrano</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed pt-6"
              >
                Descubre los secretos de Salamanca a través de la Búsqueda de Tesoros. <br className="hidden md:block" />
                Tres tesoros, un desafío y tu nota final en juego.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Link 
              to="/info" 
              className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] px-10 py-5 rounded-full font-bold text-sm hover:bg-[#5A5A40] hover:text-white transition-all group shadow-2xl shadow-black/40"
            >
              Ver Guía del Buscador
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The 3 Treasures Challenge */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif italic">El Desafío de los 3 Tesoros</h2>
            <p className="text-[#1A1A1A]/60">Actividad evaluable para el tercer trimestre de 1º Bachillerato.</p>
          </div>
          <div className="hidden md:block h-[1px] flex-1 mx-8 bg-[#1A1A1A]/10 mb-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Mirador de la Isla del Puente de la Salud", 
              icon: Landmark,
              desc: "El Puente de la Salud sirvió para cruzar el río Tormes por el ferrocarril que hacía la ruta Salamanca con Beira (Portugal). Una obra arquitectónica que la cultura popular atribuía a Eiffel y que en realidad fue desarrollada por el arquitecto Rafaél Monares.", 
              points: "+0.20",
              treasureUrl: "https://www.geocaching.com/geocache/GC97ETR_el-mirador-de-la-isla-del-puente-de-la-salud",
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "Alto de los Montalvos", 
              icon: Radio,
              desc: "Un tesoro situado en uno de los parajes más espectaculares de las cercanías de Salamanca.", 
              points: "+0.20",
              treasureUrl: "https://www.geocaching.com/geocache/GC64XXC_el-alto-de-los-montalvos",
              color: "bg-orange-50 text-orange-600"
            },
            { 
              title: "Monumento a Cristóbal Colón", 
              icon: Globe,
              desc: "Nuestro tesoro se encuentra cerca del Monumento a Colón. Este monumento que fue levantado en el paraje denominado Valcuevo en 1866 en conmemoración del Paso de Cristobal Colón por Salamanca con motivo de la explicación de sus teorías sobre el Nuevo Mundo.", 
              points: "+0.30",
              treasureUrl: "https://www.geocaching.com/geocache/GCXF1G_monumento-a-cristobal-colon-en-valcuevo",
              color: "bg-yellow-50 text-yellow-600"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[32px] border border-[#1A1A1A]/5 shadow-sm space-y-6 flex flex-col"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", item.color)}>
                <item.icon className="w-7 h-7" />
              </div>
              
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-serif italic leading-tight">{item.title}</h3>
                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{item.desc}</p>
              </div>
              
                <div className="space-y-4 pt-4 border-t border-[#1A1A1A]/5">
                  <div className="space-y-3">
                    <a 
                      href={item.treasureUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5A5A40] font-bold text-sm hover:underline"
                    >
                      Accede al TESORO
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {mission.student && mission.completedTreasures.length < 3 ? (
                        <>
                          <button 
                            onClick={handleContinueSearch}
                            className="w-full py-3 bg-[#5A5A40] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all shadow-md shadow-[#5A5A40]/10"
                          >
                            Continuar Búsqueda
                          </button>
                          <button 
                            onClick={handleStartSearch}
                            className="w-full py-3 bg-white text-[#5A5A40] border border-[#5A5A40]/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                          >
                            Nueva Búsqueda
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={handleStartSearch}
                          className="w-full py-3 bg-[#5A5A40] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all shadow-md shadow-[#5A5A40]/10"
                        >
                          {mission.completedTreasures.length === 3 ? 'Nueva Búsqueda' : 'Empezar Búsqueda'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Nota Final</span>
                    <span className="font-mono font-bold text-[#5A5A40]">{item.points}</span>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Info Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif italic leading-tight">¿Por qué la Búsqueda de Tesoros en Educación Física?</h2>
            <p className="text-[#1A1A1A]/70 leading-relaxed">
              No es solo caminar. Es orientación, es historia, es tecnología y es salud. 
              A través de esta actividad desarrollaremos competencias digitales y motrices 
              mientras exploramos nuestro entorno.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              { icon: MapPin, text: "Orientación en entornos urbanos y naturales." },
              { icon: ShieldCheck, text: "Respeto por el medio ambiente y patrimonio." },
              { icon: Trophy, text: "Gamificación del aprendizaje motor." }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative aspect-[4/5] md:aspect-square rounded-[48px] overflow-hidden shadow-2xl shadow-[#5A5A40]/10 border border-[#1A1A1A]/5">
          <img 
            src="https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/altomontalvos.jpeg" 
            alt="Alto de los Montalvos" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/80 backdrop-blur-md rounded-[32px] border border-white/40 shadow-lg">
            <p className="text-sm italic font-serif text-[#1A1A1A]/80 leading-relaxed">
              "El mundo es tu patio de recreo. Encuentra el tesoro, deja un mensaje, vive la aventura."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-[1px] w-4 bg-[#5A5A40]/30" />
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#5A5A40]">José Carlos Tejedor</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
