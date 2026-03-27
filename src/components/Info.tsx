import React from 'react';
import { motion } from 'motion/react';
import { History, Shield, Lightbulb, Compass, Globe, MessageSquare, X, ZoomIn } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export default function Info() {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const salamancaMapUrl = "https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/geocachessalamanca.jpg";

  return (
    <div className="max-w-4xl mx-auto space-y-20">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif italic">Guía del Buscador</h1>
        <p className="text-[#1A1A1A]/60 max-w-xl mx-auto">
          Todo lo que necesitas saber para convertirte en un experto buscador de tesoros en el IES Lucía de Medrano.
        </p>
      </header>

      {/* History Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <History className="w-8 h-8 text-[#5A5A40]" />
          <h2 className="text-3xl font-serif italic">Un poco de Historia</h2>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm prose prose-neutral max-w-none">
          <p className="text-lg leading-relaxed text-[#1A1A1A]/80">
            La Búsqueda de Tesoros nació el 3 de mayo de 2000, cuando Dave Ulmer decidió celebrar que el gobierno de EE.UU. 
            eliminó la degradación de la señal GPS para uso civil. Escondió un cubo negro en el bosque y publicó 
            las coordenadas. ¡Al día siguiente alguien ya lo había encontrado!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 not-prose">
            <div className="p-6 bg-[#F5F5F0] rounded-3xl border border-[#1A1A1A]/5">
              <Globe className="w-6 h-6 mb-4 opacity-40" />
              <h4 className="font-bold mb-2">Alcance Global</h4>
              <p className="text-sm opacity-60">Hoy hay más de 3 millones de tesoros en todo el mundo, ¡incluso en la Estación Espacial Internacional!</p>
            </div>
            <div className="p-6 bg-[#F5F5F0] rounded-3xl border border-[#1A1A1A]/5">
              <Compass className="w-6 h-6 mb-4 opacity-40" />
              <h4 className="font-bold mb-2">Evolución</h4>
              <p className="text-sm opacity-60">De usar GPS militares pesados a tener toda la potencia en tu smartphone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-[#5A5A40]" />
          <h2 className="text-3xl font-serif italic">Reglas de Oro</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Firma el Logbook",
              desc: "Si no firmas el libro físico dentro del tesoro, no cuenta como encontrado. ¡Lleva siempre un bolígrafo!",
              icon: MessageSquare
            },
            {
              title: "Intercambio Justo",
              desc: "Si te llevas un objeto del tesoro, debes dejar otro de igual o mayor valor. Mantén la magia viva.",
              icon: Globe
            },
            {
              title: "Muggle Alert",
              desc: "Sé discreto. Los 'muggles' (gente que no conoce el juego) no deben ver dónde está escondido el tesoro.",
              icon: Shield
            }
          ].map((rule, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-[32px] border border-[#1A1A1A]/5 shadow-sm text-center space-y-4"
            >
              <div className="w-12 h-12 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white mx-auto">
                <rule.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic text-xl">{rule.title}</h3>
              <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-[#151619] text-white p-12 rounded-[48px] space-y-8">
        <div className="flex items-center gap-4">
          <Lightbulb className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-serif italic">Consejos Prácticos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-white/60">Para tus misiones en Salamanca:</p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-[#5A5A40] font-mono font-bold">01</span>
                <span>Mira arriba, abajo y detrás. Los tesoros suelen estar camuflados.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#5A5A40] font-mono font-bold">02</span>
                <span>Lee las pistas (hints) solo si estás realmente atascado.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#5A5A40] font-mono font-bold">03</span>
                <span>Comprueba los logs recientes para ver si el tesoro ha sido encontrado últimamente.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#5A5A40] font-mono font-bold">04</span>
                <span>Regístrate en <a href="https://www.geocaching.com/" target="_blank" rel="noopener noreferrer" className="text-[#5A5A40] underline">geocaching.com</a> <span className="text-[10px] opacity-40">(abre pestaña nueva)</span> y podrás acceder a todos los tesoros del mundo.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#5A5A40] font-mono font-bold">05</span>
                <span>En la siguiente imagen puedes ver todos los tesoros que hay en Salamanca. Amplía con los dedos.</span>
              </li>
            </ul>
          </div>
          <div 
            className="relative rounded-3xl overflow-hidden aspect-video md:aspect-auto cursor-zoom-in group"
            onClick={() => setIsZoomed(true)}
          >
            <img 
              src={salamancaMapUrl} 
              alt="Tesoros en Salamanca" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsZoomed(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2"
              onClick={() => setIsZoomed(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full overflow-auto rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={salamancaMapUrl} 
                alt="Mapa de Salamanca ampliado" 
                className="max-w-none w-full md:w-auto md:max-h-[90vh] object-contain cursor-grab active:cursor-grabbing"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono uppercase tracking-widest">
              Usa los dedos para ampliar en móvil
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
