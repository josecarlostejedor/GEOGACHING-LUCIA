import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, Users, ArrowRight, UserPlus } from 'lucide-react';
import { useMission } from '@/src/context/MissionContext.tsx';

export default function Registration() {
  const navigate = useNavigate();
  const { mission, startMission } = useMission();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = React.useState({
    alumno: {
      nombre: mission.student?.nombre || '',
      apellidos: mission.student?.apellidos || '',
      edad: mission.student?.edad || '',
      curso: mission.student?.curso || '1º BACH',
      grupo: mission.student?.grupo || '1'
    },
    acompanante: {
      nombre: mission.companion?.nombre || '',
      apellidos: mission.companion?.apellidos || '',
      edad: mission.companion?.edad || '',
      relacion: mission.companion?.relacion || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startMission(formData.alumno, formData.acompanante);
    navigate('/map');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex p-3 bg-[#5A5A40]/10 rounded-2xl text-[#5A5A40] mb-2">
          <UserPlus className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-serif italic">Registro del Buscador</h1>
        <p className="text-[#1A1A1A]/60">Completa tus datos para comenzar la aventura.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Alumno Section */}
        <section className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-[#1A1A1A]/5 pb-6">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif italic">Alumno Participante</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Nombre</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Ej. Ana"
                value={formData.alumno.nombre}
                onChange={(e) => setFormData({...formData, alumno: {...formData.alumno, nombre: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Apellidos</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Ej. Martínez Ruiz"
                value={formData.alumno.apellidos}
                onChange={(e) => setFormData({...formData, alumno: {...formData.alumno, apellidos: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Edad</label>
              <input 
                required
                type="number" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Ej. 16"
                value={formData.alumno.edad}
                onChange={(e) => setFormData({...formData, alumno: {...formData.alumno, edad: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Curso</label>
              <select 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all appearance-none"
                value={formData.alumno.curso}
                onChange={(e) => setFormData({...formData, alumno: {...formData.alumno, curso: e.target.value}})}
              >
                {['1º ESO', '2º ESO', '3º ESO', '4º ESO', '1º BACH', '2º BACH', 'FP', 'Otros niveles educativos'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Grupo</label>
              <div className="flex flex-wrap gap-3">
                {['1', '2', '3', '4', '5', '6', '7'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, alumno: {...formData.alumno, grupo: g}})}
                    className={`w-12 h-12 rounded-xl font-mono font-bold transition-all ${
                      formData.alumno.grupo === g 
                        ? 'bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20' 
                        : 'bg-[#F5F5F0] text-[#1A1A1A]/40 hover:bg-[#E4E3E0]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Acompañante Section */}
        <section className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-[#1A1A1A]/5 pb-6">
            <div className="w-10 h-10 bg-[#5A5A40]/10 rounded-xl flex items-center justify-center text-[#5A5A40]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif italic">Persona Acompañante</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Nombre</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Nombre del acompañante"
                value={formData.acompanante.nombre}
                onChange={(e) => setFormData({...formData, acompanante: {...formData.acompanante, nombre: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Apellidos</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Apellidos del acompañante"
                value={formData.acompanante.apellidos}
                onChange={(e) => setFormData({...formData, acompanante: {...formData.acompanante, apellidos: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Edad</label>
              <input 
                required
                type="number" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Edad"
                value={formData.acompanante.edad}
                onChange={(e) => setFormData({...formData, acompanante: {...formData.acompanante, edad: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Relación con el alumno</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                placeholder="Ej. Padre, Madre, Hermano..."
                value={formData.acompanante.relacion}
                onChange={(e) => setFormData({...formData, acompanante: {...formData.acompanante, relacion: e.target.value}})}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <button 
            type="submit"
            className="group inline-flex items-center gap-3 bg-[#5A5A40] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#4A4A30] transition-all shadow-xl shadow-[#5A5A40]/20"
          >
            Siguiente
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
