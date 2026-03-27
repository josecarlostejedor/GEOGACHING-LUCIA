import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, CheckCircle2, Lock, Info, Star, Clock, Camera, FileText, X, Home, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useMission } from '../context/MissionContext';
import { jsPDF } from 'jspdf';

const TREASURES = [
  {
    id: 1,
    title: "Mirador de la Isla del Puente de la Salud",
    coords: "N 40° 57.613 W 005° 42.761",
    utm: "30T E 271710 N 4537883",
    lat: 40.960217,
    lon: -5.712683,
    hint: "Donde el hierro cruza el Tormes, busca el mirador de la isla.",
    imageUrl: "https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/puentedelasaludinforme.jpg",
    treasureUrl: "https://www.geocaching.com/geocache/GC97ETR_el-mirador-de-la-isla-del-puente-de-la-salud",
    status: "available",
    difficulty: "Fácil",
    points: "+0.20",
    locked: false
  },
  {
    id: 2,
    title: "Alto de los Montalvos",
    coords: "N 40° 55.998 W 005° 44.074",
    utm: "30T E 269774 N 4534953",
    lat: 40.9333,
    lon: -5.734567,
    hint: "En las alturas que dominan el horizonte salmantino.",
    imageUrl: "https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/Elaltodelosmontalvosinforme.jpg",
    treasureUrl: "https://www.geocaching.com/geocache/GC64XXC_el-alto-de-los-montalvos",
    status: "locked",
    difficulty: "Media",
    points: "+0.20",
    locked: true
  },
  {
    id: 3,
    title: "Monumento a Cristóbal Colón",
    coords: "N 41° 03.187 W 005° 44.098",
    utm: "30T E 270157 N 4548257",
    lat: 41.053117,
    lon: -5.734967,
    hint: "Cerca de Valcuevo, donde se gestó el descubrimiento del Nuevo Mundo.",
    imageUrl: "https://raw.githubusercontent.com/josecarlostejedor/GEOGACHING-LUCIA/main/Monumentocoloninforme.jpg",
    treasureUrl: "https://www.geocaching.com/geocache/GCXF1G_monumento-a-cristobal-colon-en-valcuevo",
    status: "locked",
    difficulty: "Difícil",
    points: "+0.30",
    locked: true
  }
];

export default function MapQuest() {
  const navigate = useNavigate();
  const { mission, stopMission, resumeMission, startNewTreasure, resetMission } = useMission();
  
  // Update treasures based on mission progress
  const treasures = TREASURES.map(t => {
    const isCompleted = mission.completedTreasures.includes(t.id);
    const isPreviousCompleted = t.id === 1 || mission.completedTreasures.includes(t.id - 1);
    
    return {
      ...t,
      status: isCompleted ? "completed" : isPreviousCompleted ? "available" : "locked",
      locked: !isPreviousCompleted
    };
  });

  const [selected, setSelected] = React.useState(treasures[0]);
  const [reportingTreasure, setReportingTreasure] = React.useState<any>(null);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [isMissionCompleted, setIsMissionCompleted] = React.useState(true);
  const [experience, setExperience] = React.useState('');
  const [image, setImage] = React.useState<string | null>(null);

  // Sync selected treasure if it changes from locked to available
  React.useEffect(() => {
    const current = treasures.find(t => t.id === selected.id);
    
    // If current is completed, try to select the next available one
    if (current?.status === 'completed') {
      const nextAvailable = treasures.find(t => t.status === 'available');
      if (nextAvailable) {
        setSelected(nextAvailable);
      } else {
        // If no more available, just update current state
        setSelected(current);
      }
    } else if (current) {
      setSelected(current);
    }
  }, [mission.completedTreasures]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const syncDataToSheets = async (currentExperience: string, treasure: any, earnedPoints: number) => {
    const sheetsUrl = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;
    
    console.log("🔍 Depuración de Sincronización:");
    console.log("   - URL configurada:", sheetsUrl);
    console.log("   - ¿URL definida?:", !!sheetsUrl);
    
    if (!sheetsUrl) {
      console.warn("⚠️ Google Sheets URL no configurada en .env o en las variables de entorno de Vite.");
      return;
    }

    const trimmedUrl = sheetsUrl.trim();
    if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
      console.error("❌ ERROR: Has configurado la URL de la HOJA DE CÁLCULO, pero necesitas la URL de la APLICACIÓN WEB (desplegada desde Apps Script).");
      return;
    }

    const data = {
      timestamp: new Date().toLocaleString(),
      studentNombre: mission.student?.nombre || 'N/A',
      studentApellidos: mission.student?.apellidos || 'N/A',
      studentEdad: mission.student?.edad || 'N/A',
      studentCurso: mission.student?.curso || 'N/A',
      studentGrupo: mission.student?.grupo || 'N/A',
      companionNombre: mission.companion?.nombre || 'N/A',
      companionApellidos: mission.companion?.apellidos || 'N/A',
      companionEdad: mission.companion?.edad || 'N/A',
      companionRelacion: mission.companion?.relacion || 'N/A',
      treasureTitle: treasure.title || 'Desconocido',
      individualTreasurePoints: earnedPoints.toString(),
      totalPoints: (mission.totalPoints || 0).toFixed(2),
      searchTime: formatTime(mission.elapsedTime),
      experience: currentExperience || "Sin comentarios"
    };

    console.log("📤 Intentando sincronizar datos con Google Sheets...", data);

    try {
      // Usamos fetch con mode: 'no-cors', redirect: 'follow' y text/plain para máxima compatibilidad con Vercel y Apps Script
      await fetch(trimmedUrl, {
        method: 'POST',
        mode: 'no-cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data)
      });
      console.log("✅ Petición de sincronización enviada a:", trimmedUrl);
    } catch (error) {
      console.error("❌ Error al sincronizar con Google Sheets:", error);
    }
  };

  const generatePDF = async () => {
    if (!reportingTreasure) return;
    console.log("📄 Iniciando generación de PDF (Protocolo Robusto)...");
    
    // 1. Configuración Estándar (mm, a4)
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    
    // Sync data to Google Sheets in background
    const earnedPoints = isMissionCompleted ? parseFloat(reportingTreasure.points.replace('+', '')) : 0;
    syncDataToSheets(experience, reportingTreasure, earnedPoints);
    
    console.log("🎨 Dibujando cabecera...");
    // Header Background
    doc.setFillColor(90, 90, 64); // #5A5A40 (Olive)
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('times', 'italic');
    doc.text('Practicando Búsqueda de Tesoros en el IES Lucía de Medrano.', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Departamento de Educación Física', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('App creada por Jose Carlos Tejedor', pageWidth / 2, 38, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(26, 26, 26);

    console.log("📦 Dibujando resumen de misión...");
    // Mission Summary Box
    doc.setFillColor(245, 245, 240); // #F5F5F0 (Cream)
    doc.roundedRect(margin, 55, pageWidth - (margin * 2), 25, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setFont('times', 'bolditalic');
    if (!isMissionCompleted) {
      doc.setTextColor(128, 0, 0); // Granate
    }
    doc.text((isMissionCompleted ? 'Misión Completada: ' : 'Misión No Completada: ') + reportingTreasure.title.toUpperCase(), margin + 5, 65);
    doc.setTextColor(26, 26, 26); // Reset
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin + 5, 73);
    doc.text(`Tiempo de búsqueda: ${formatTime(mission.elapsedTime)}`, pageWidth - margin - 5, 73, { align: 'right' });

    // Data Sections
    let currentY = 95;

    const drawSection = (title: string, data: { label: string, value: string | undefined }[]) => {
      doc.setFontSize(12);
      doc.setFont('times', 'bolditalic');
      doc.setTextColor(90, 90, 64);
      doc.text(title, margin, currentY);
      doc.setDrawColor(90, 90, 64);
      doc.setLineWidth(0.2);
      doc.line(margin, currentY + 2, margin + 40, currentY + 2);
      
      currentY += 10;
      doc.setTextColor(26, 26, 26);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      data.forEach(item => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, margin + 5, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.value || 'N/A'}`, margin + 45, currentY);
        currentY += 7;
      });
      currentY += 10;
    };

    console.log("👤 Dibujando secciones de datos...");
    drawSection('DATOS DEL ALUMNO', [
      { label: 'Nombre Completo', value: `${mission.student?.nombre} ${mission.student?.apellidos}` },
      { label: 'Edad', value: `${mission.student?.edad} años` },
      { label: 'Curso y Grupo', value: `${mission.student?.curso} - Grupo ${mission.student?.grupo}` }
    ]);

    drawSection('PERSONA ACOMPAÑANTE', [
      { label: 'Nombre Completo', value: `${mission.companion?.nombre} ${mission.companion?.apellidos}` },
      { label: 'Relación', value: `${mission.companion?.relacion}` }
    ]);

    // Experience
    doc.setFontSize(12);
    doc.setFont('times', 'bolditalic');
    doc.setTextColor(90, 90, 64);
    doc.text('EXPERIENCIA DEL BUSCADOR', margin, currentY);
    currentY += 8;
    
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    const splitExperience = doc.splitTextToSize(experience, pageWidth - (margin * 2));
    doc.text(splitExperience, margin, currentY);
    currentY += (splitExperience.length * 5) + 15;

    // Treasure Reference Image with Link (Protocolo Base64)
    if (reportingTreasure.imageUrl) {
      console.log("🖼️ Procesando imagen de referencia del tesoro...");
      doc.setFontSize(12);
      doc.setFont('times', 'bolditalic');
      doc.setTextColor(90, 90, 64);
      doc.text('REFERENCIA DEL TESORO (Clic para ver en la web)', margin, currentY);
      currentY += 5;
      
      try {
        // Protocolo: Descargar imagen a Base64 antes de insertar
        const response = await fetch(reportingTreasure.imageUrl);
        const blob = await response.blob();
        const base64 = await new Promise<string>((r) => {
          const reader = new FileReader();
          reader.onloadend = () => r(reader.result as string);
          reader.readAsDataURL(blob);
        });

        const imgProps = doc.getImageProperties(base64);
        const imgWidth = 60;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        doc.addImage(base64, imgProps.fileType, margin, currentY, imgWidth, imgHeight, undefined, 'FAST');
        
        if (reportingTreasure.treasureUrl) {
          doc.link(margin, currentY, imgWidth, imgHeight, { url: reportingTreasure.treasureUrl });
        }
        currentY += imgHeight + 10;
      } catch (e) {
        console.error("❌ Error al procesar imagen de referencia en PDF:", e);
        doc.setFontSize(8);
        doc.setTextColor(255, 0, 0);
        doc.text('[Error al cargar imagen de referencia]', margin, currentY);
        currentY += 10;
      }
    }

    // Image Page (Evidencia Fotográfica)
    if (image) {
      console.log("📸 Añadiendo página de evidencia fotográfica...");
      doc.addPage();
      // Header repeated or simplified
      doc.setFillColor(90, 90, 64);
      doc.rect(0, 0, pageWidth, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont('times', 'bolditalic');
      doc.setTextColor(90, 90, 64);
      doc.text('EVIDENCIA FOTOGRÁFICA', margin, 30);
      
      try {
        // La imagen ya es Base64 (del handleImageUpload)
        const imgProps = doc.getImageProperties(image);
        const imgW = pageWidth - (margin * 2);
        const imgH = (imgProps.height * imgW) / imgProps.width;
        
        // Si la imagen es muy alta, limitamos su altura para que no se salga de la página
        const maxH = pageHeight - 60;
        const finalH = Math.min(imgH, maxH);
        const finalW = (imgProps.width * finalH) / imgProps.height;
        
        // Centrar imagen
        const xOffset = (pageWidth - finalW) / 2;
        
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(1);
        doc.rect(xOffset - 2, 38, finalW + 4, finalH + 4);
        doc.addImage(image, imgProps.fileType, xOffset, 40, finalW, finalH, undefined, 'FAST');
      } catch (e) {
        console.error("❌ Error al procesar evidencia fotográfica en PDF:", e);
        doc.setTextColor(255, 0, 0);
        doc.text('[Error al procesar la imagen de evidencia]', margin, 50);
      }
    }

    console.log("🔢 Añadiendo números de página y pie de página...");
    // Page numbers and Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(90, 90, 64);
      doc.setLineWidth(0.1);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'italic');
      doc.text(`Informe generado por la App Búsqueda de Tesoros IES Lucía de Medrano`, margin, pageHeight - 10);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    console.log("💾 Guardando archivo PDF...");
    doc.save(`Informe_Mision_${mission.student?.nombre}_${reportingTreasure.id}.pdf`);
  };

  const handleGoHome = () => {
    if (reportingTreasure) {
      const earnedPoints = isMissionCompleted ? parseFloat(reportingTreasure.points.replace('+', '')) : 0;
      syncDataToSheets(experience, reportingTreasure, earnedPoints);
    }
    navigate('/');
  };

  const handleContinue = () => {
    if (reportingTreasure) {
      const earnedPoints = isMissionCompleted ? parseFloat(reportingTreasure.points.replace('+', '')) : 0;
      syncDataToSheets(experience, reportingTreasure, earnedPoints);
    }
    setShowReportModal(false);
    setReportingTreasure(null);
    setExperience('');
    setImage(null);
    startNewTreasure();
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${selected.lon - 0.005},${selected.lat - 0.005},${selected.lon + 0.005},${selected.lat + 0.005}&layer=mapnik&marker=${selected.lat},${selected.lon}`;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic">Mapa de Misiones</h1>
          <p className="text-[#1A1A1A]/60">Explora Salamanca y encuentra los 3 tesoros evaluables.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-4 bg-[#151619] text-white px-6 py-3 rounded-2xl shadow-lg border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#5A5A40] flex items-center justify-center">
              <Clock className={cn("w-5 h-5", mission.isActive && "animate-pulse")} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold opacity-50">Tiempo de Búsqueda</span>
              <span className="font-mono text-xl font-bold tracking-tighter">{formatTime(mission.elapsedTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-[#1A1A1A]/5 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Progreso</span>
              <span className="font-mono font-bold text-[#5A5A40]">{mission.completedTreasures.length} / 3 Encontrados</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#F5F5F0] border-t-[#5A5A40] flex items-center justify-center text-[10px] font-bold">
              {Math.round((mission.completedTreasures.length / 3) * 100)}%
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Visualization (OpenStreetMap) */}
        <div className="lg:col-span-2 relative aspect-[16/10] bg-[#E4E3E0] rounded-[40px] overflow-hidden border border-[#1A1A1A]/10 shadow-inner">
          <iframe
            title="OpenStreetMap"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="filter grayscale-[0.2] contrast-[1.1]"
          />
          
          {/* Map Overlay Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            {treasures.map((t) => (
              <button
                key={t.id}
                onClick={() => !t.locked && setSelected(t)}
                className={cn(
                  "w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all",
                  t.locked ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 
                  selected.id === t.id ? "bg-[#5A5A40] text-white scale-110" : "bg-white text-[#1A1A1A] hover:bg-gray-50"
                )}
              >
                {t.locked ? <Lock className="w-4 h-4" /> : 
                 mission.completedTreasures.includes(t.id) ? <CheckCircle2 className="w-5 h-5" /> :
                 <span className="font-mono font-bold text-xs">{t.id}</span>}
              </button>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-[10px] font-mono shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="opacity-60 uppercase tracking-tighter">Ubicación Seleccionada</span>
            </div>
            <div className="space-y-0.5">
              <p><span className="font-bold">DMS:</span> {selected.coords}</p>
              <p><span className="font-bold">UTM:</span> {selected.utm}</p>
            </div>
          </div>
        </div>

        {/* Quest Details */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-[40px] border border-[#1A1A1A]/5 shadow-sm space-y-8 h-full flex flex-col"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    selected.difficulty === "Fácil" ? "bg-green-100 text-green-700" : 
                    selected.difficulty === "Media" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                  )}>
                    {selected.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-[#5A5A40]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-mono font-bold">{selected.points}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-serif italic leading-tight">{selected.title}</h2>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#1A1A1A]/60 font-mono">
                    <Navigation className="w-3 h-3" />
                    {selected.coords}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#1A1A1A]/40 font-mono">
                    <div className="w-3 h-3" />
                    {selected.utm}
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="p-6 bg-[#F5F5F0] rounded-3xl border border-[#1A1A1A]/5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 opacity-40">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Pista del Profesor</span>
                    </div>
                    <p className="text-sm italic font-serif leading-relaxed">"{selected.hint}"</p>
                  </div>
                  
                  {selected.imageUrl && (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-[#1A1A1A]/10 group bg-white/40 p-2">
                      <img 
                        src={selected.imageUrl} 
                        alt={selected.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                </div>
              </div>

                <div className="space-y-4">
                  {mission.completedTreasures.length === 3 ? (
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center space-y-3">
                      <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                      <h3 className="text-xl font-serif italic text-green-800">¡Misión Completada con Éxito!</h3>
                      <p className="text-sm text-green-700/70">Has encontrado todos los tesoros de Salamanca. ¡Enhorabuena!</p>
                      <button 
                        onClick={() => {
                          resetMission();
                          navigate('/');
                        }}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reiniciar Todo
                      </button>
                    </div>
                  ) : !mission.isActive && !mission.completedTreasures.includes(selected.id) && !selected.locked ? (
                    <button 
                      onClick={() => resumeMission()}
                      className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Iniciar Búsqueda
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          const pointsValue = parseFloat(selected.points.replace('+', ''));
                          stopMission(selected.id, pointsValue);
                          setIsMissionCompleted(true);
                          setReportingTreasure(selected);
                          setShowReportModal(true);
                        }}
                        disabled={selected.locked || mission.completedTreasures.includes(selected.id) || !mission.isActive}
                        className={cn(
                          "w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2",
                          (selected.locked || mission.completedTreasures.includes(selected.id) || !mission.isActive)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-[#5A5A40] text-white hover:bg-[#4A4A30] shadow-lg shadow-[#5A5A40]/20"
                        )}
                      >
                        {mission.completedTreasures.includes(selected.id) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Tesoro Encontrado
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Misión Completada
                          </>
                        )}
                      </button>

                      {mission.isActive && !mission.completedTreasures.includes(selected.id) && !selected.locked && (
                        <button 
                          onClick={() => {
                            stopMission(selected.id, 0);
                            setIsMissionCompleted(false);
                            setReportingTreasure(selected);
                            setShowReportModal(true);
                          }}
                          className="w-full py-4 bg-[#800000] text-white rounded-full font-bold hover:bg-[#600000] transition-all shadow-lg shadow-[#800000]/20 flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Misión NO Completada
                        </button>
                      )}
                    </div>
                  )}
                {selected.locked && mission.completedTreasures.length < 3 && (
                  <p className="text-[10px] text-center uppercase tracking-widest font-bold opacity-40">
                    Completa la misión anterior para desbloquear
                  </p>
                )}
                {!mission.isActive && !mission.completedTreasures.includes(selected.id) && !selected.locked && mission.completedTreasures.length < 3 && (
                   <p className="text-[10px] text-center uppercase tracking-widest font-bold opacity-40">
                    Pulsa para iniciar el cronómetro de búsqueda
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-[#1A1A1A]/5 flex items-center justify-between bg-[#F5F5F0]">
                <div className="space-y-1">
                  <h3 className={cn("text-2xl font-serif italic", !isMissionCompleted && "text-[#800000]")}>
                    {isMissionCompleted ? "Misión Completada" : "Misión No Completada"}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest font-bold">Generar Informe de Tesoro</p>
                </div>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto">
                {/* Experience Description */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Describe tu experiencia</label>
                  <textarea 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Cuéntanos cómo fue la búsqueda, qué dificultades tuviste..."
                    className="w-full h-32 px-6 py-4 bg-[#F5F5F0] rounded-3xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all resize-none italic font-serif"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Sube una imagen del tesoro</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={cn(
                      "w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all overflow-hidden",
                      image ? "border-[#5A5A40] bg-white" : "border-[#1A1A1A]/10 bg-[#F5F5F0] group-hover:border-[#5A5A40]/40"
                    )}>
                      {image ? (
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Camera className="w-6 h-6 text-[#5A5A40]" />
                          </div>
                          <span className="text-sm font-medium text-[#1A1A1A]/40">Haz clic o arrastra una foto</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F5F5F0] border-t border-[#1A1A1A]/5 space-y-4">
                <button 
                  onClick={generatePDF}
                  disabled={!experience || !image}
                  className="w-full py-5 bg-[#5A5A40] text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#4A4A30] transition-all shadow-xl shadow-[#5A5A40]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-6 h-6" />
                  Generar Informe PDF
                </button>
                
                {mission.completedTreasures.length < 3 && (
                  <button 
                    onClick={handleContinue}
                    className="w-full py-4 bg-white text-[#5A5A40] rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all border border-[#5A5A40]/20"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Continuar Búsqueda
                  </button>
                )}

                  <button 
                    onClick={handleGoHome}
                    className="w-full py-4 bg-white text-[#1A1A1A] rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all border border-[#1A1A1A]/5"
                  >
                    <Home className="w-4 h-4" />
                    Volver al Inicio
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
