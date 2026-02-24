import React, { useState } from 'react';
import { Leaf, Activity, Brain, Heart, Sparkles, Loader2, Download, MessageCircle, ArrowRight, User, Phone } from 'lucide-react';

// 1️⃣ PEGA TU CLAVE API ENTRE ESTAS COMILLAS:
const apiKey = "AIzaSyCAePIbGCFTjvkNuJ5pK1f5F5nz-h8BXt8"; 

export default function App() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [printMessage, setPrintMessage] = useState('');
  
  // --- IMÁGENES DE TU MARCA ---
  const logoUrl = "https://i.postimg.cc/x1JZwGJP/logo-gratia-ia.png";
  const coverUrl = "https://i.postimg.cc/50xn28yM/diagnostico.png";

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fisica: '',
    mental: '',
    emocional: '',
    espiritual: ''
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLabelAndColor = (score) => {
    if (score >= 4) return { label: "🌿 Equilibrio", color: "bg-green-400", text: "text-green-700" };
    if (score === 3) return { label: "⚪ Zona de ajuste", color: "bg-yellow-300", text: "text-yellow-700" };
    return { label: "🔸 Desequilibrio activo", color: "bg-red-400", text: "text-red-700" };
  };

  const analyzeData = async () => {
    // Basic validation
    if (!formData.nombre || !formData.fisica || !formData.mental || !formData.emocional || !formData.espiritual) {
      setError("Por favor, déjame tu nombre y completa todos los espacios para poder guiarte mejor. 🤍");
      return;
    }

    setIsLoading(true);
    setError('');

    const promptText = `
      Analiza las siguientes respuestas de una usuaria llamada "${formData.nombre}" sobre sus 4 dimensiones de bienestar:
      1. Física: "${formData.fisica}"
      2. Mental: "${formData.mental}"
      3. Emocional: "${formData.emocional}"
      4. Espiritual: "${formData.espiritual}"

      Instrucciones:
      1. Puntúa cada dimensión del 1 al 5 (1 = desequilibrio severo/malestar, 5 = equilibrio ideal/bienestar).
      2. Identifica la dimensión con la puntuación más baja (si hay empate, elige la que percibas que necesita más atención urgente).
      3. Redacta un mensaje empático, cálido y comprensivo dirigido a ${formData.nombre} sobre esa dimensión más baja.
      4. Sugiere 1 "Hábito Fundamental" (algo sólido pero alcanzable).
      5. Sugiere 1 "Microhábito" (una acción minúscula de menos de 2 minutos que pueda hacer hoy mismo).
      
      IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON con esta estructura exacta, sin texto adicional:
      {
        "scores": {
          "fisica": numero,
          "mental": numero,
          "emocional": numero,
          "espiritual": numero
        },
        "lowestDimension": "Nombre de la dimensión (Física, Mental, Emocional o Espiritual)",
        "empatheticMessage": "Tu mensaje aquí...",
        "fundamentalHabit": "Hábito fundamental aquí...",
        "microHabit": "Microhábito aquí..."
      }
    `;

    const systemInstruction = "Eres 'Gratia', una coach de bienestar femenina, empática, serena y experta. Tu tono es dulce, comprensivo y motivador. Todo tu análisis y respuestas deben estar estrictamente en ESPAÑOL.";

    try {
      if (!apiKey) throw new Error("Falta configurar la Clave de Google AI. Pega tu clave en la línea 4 del código.");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error('No pudimos conectar con La Brújula. Intenta nuevamente.');

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponseText) throw new Error('Recibimos una respuesta vacía.');

      const parsedResult = JSON.parse(aiResponseText);
      setResult(parsedResult);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || "Hubo un pequeño error al leer tu brújula. Por favor, intenta de nuevo en unos momentos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
      setPrintMessage("Nota: Si no se abre el PDF, es por la vista de prueba. ¡En tu web real funcionará perfecto! ✨");
      setTimeout(() => setPrintMessage(''), 6000);
    } catch (e) {
      console.error("Error al imprimir:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9C8C8] to-[#DBB2B2] text-gray-800 font-sans selection:bg-[#D4AF37] selection:text-white pb-12 pt-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Lato', sans-serif; }
        
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-break-inside-avoid { page-break-inside: avoid; }
          .print-shadow-none { box-shadow: none !important; border: 1px solid #e5e7eb; }
          .print-bg-transparent { background: transparent !important; }
          .print-text-black { color: black !important; }
        }
      `}} />

      {step === 1 && (
        <div className="w-full max-w-3xl bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl p-8 sm:p-12 transition-all duration-500 border border-white/50">
          <div className="text-center mb-10">
            <img src={logoUrl} alt="Logo de Gratia" className="h-28 sm:h-32 mx-auto mb-6 object-contain" />
            
            <div className="w-full max-w-xs sm:max-w-sm mx-auto aspect-square mb-8 rounded-2xl overflow-hidden shadow-sm border border-[#F9C8C8]/30">
              <img src={coverUrl} alt="Portada de bienestar" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif text-[#B76E79] mb-4 tracking-wide">
              Bienvenida a La Brújula de Gratia ✨
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
              Tómate una pausa, respira profundo y cuéntame con total libertad en estos espacios. Este es tu lugar seguro.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Campos Personales */}
            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-white/40 rounded-2xl border border-white">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-[#B76E79] font-serif font-semibold">
                  <User size={18} /> <span>Tu Nombre *</span>
                </label>
                <input 
                  type="text" name="nombre" value={formData.nombre} onChange={handleInputChange}
                  className="w-full p-3 bg-white/70 border border-[#DBB2B2]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Ej. María Pérez"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-[#B76E79] font-serif font-semibold">
                  <Phone size={18} /> <span>Tu Teléfono / WhatsApp</span>
                </label>
                <input 
                  type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange}
                  className="w-full p-3 bg-white/70 border border-[#DBB2B2]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="+54 9 11..."
                />
              </div>
            </div>

            <hr className="border-[#DBB2B2]/30" />

            {/* Dimensión Física */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[#B76E79] font-serif text-xl font-semibold">
                <Activity size={20} />
                <span>Tu Cuerpo <span className="text-gray-500 text-sm font-sans font-normal">(Dimensión Física)</span></span>
              </label>
              <p className="text-gray-600 text-sm italic">¿Cómo sientes tu energía, tu alimentación y tu descanso a diario?</p>
              <textarea 
                name="fisica" value={formData.fisica} onChange={handleInputChange}
                className="w-full h-32 p-4 bg-white/50 border border-[#DBB2B2]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none shadow-inner"
                placeholder="Escribe aquí con total libertad..."
              />
            </div>

            {/* Dimensión Mental */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[#B76E79] font-serif text-xl font-semibold">
                <Brain size={20} />
                <span>Tu Mente <span className="text-gray-500 text-sm font-sans font-normal">(Dimensión Mental)</span></span>
              </label>
              <p className="text-gray-600 text-sm italic">¿Sientes claridad para organizarte o tu cabeza no para de pensar?</p>
              <textarea 
                name="mental" value={formData.mental} onChange={handleInputChange}
                className="w-full h-32 p-4 bg-white/50 border border-[#DBB2B2]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none shadow-inner"
                placeholder="Escribe aquí..."
              />
            </div>

            {/* Dimensión Emocional */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[#B76E79] font-serif text-xl font-semibold">
                <Heart size={20} />
                <span>Tu Corazón <span className="text-gray-500 text-sm font-sans font-normal">(Dimensión Emocional)</span></span>
              </label>
              <p className="text-gray-600 text-sm italic">¿Cómo has gestionado el estrés, la culpa o tus límites últimamente?</p>
              <textarea 
                name="emocional" value={formData.emocional} onChange={handleInputChange}
                className="w-full h-32 p-4 bg-white/50 border border-[#DBB2B2]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none shadow-inner"
                placeholder="Tus sentimientos importan, escríbelos aquí..."
              />
            </div>

            {/* Dimensión Espiritual */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-[#B76E79] font-serif text-xl font-semibold">
                <Sparkles size={20} />
                <span>Tu Alma <span className="text-gray-500 text-sm font-sans font-normal">(Dimensión Espiritual)</span></span>
              </label>
              <p className="text-gray-600 text-sm italic">¿Sientes que tus días tienen un propósito claro o vas en piloto automático, sientes que haces algo que te gusta como un hobbie o algo que te genera felicidad?</p>
              <textarea 
                name="espiritual" value={formData.espiritual} onChange={handleInputChange}
                className="w-full h-32 p-4 bg-white/50 border border-[#DBB2B2]/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none shadow-inner"
                placeholder="Déjate llevar y escribe..."
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={analyzeData}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#D4AF37] to-[#e5c158] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={24} />
                  Analizando tu Mapa...
                </>
              ) : (
                <>
                  Descubrir mi Mapa <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="w-full max-w-4xl bg-[#FDFAFA] print-bg-transparent print-shadow-none shadow-2xl rounded-3xl overflow-hidden border border-white/60">
          
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <img src={logoUrl} alt="Logo de Gratia" className="h-20 sm:h-24 mx-auto mb-6 object-contain print-break-inside-avoid" />
              <h2 className="text-4xl font-serif text-[#B76E79] mb-3">Tu Mapa de Bienestar</h2>
              <p className="text-gray-500 font-light">Este es un reflejo de tu momento presente, creado con compasión y sin juicios.</p>
            </div>

            {/* Identificación del Usuario en el reporte */}
            <div className="mb-10 text-center print-break-inside-avoid">
              <div className="inline-block px-8 py-3 bg-[#F9C8C8]/20 rounded-full border border-[#DBB2B2]/30">
                <p className="font-serif text-lg text-gray-700">
                  Mapa elaborado para: <span className="text-[#B76E79] font-semibold">{formData.nombre}</span>
                </p>
                {formData.telefono && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Phone size={14} /> {formData.telefono}
                  </p>
                )}
              </div>
            </div>

            {/* Dimension Bars */}
            <div className="grid gap-6 mb-12">
              {[
                { key: 'fisica', label: 'Física (Tu Cuerpo)', icon: Activity },
                { key: 'mental', label: 'Mental (Tu Mente)', icon: Brain },
                { key: 'emocional', label: 'Emocional (Tu Corazón)', icon: Heart },
                { key: 'espiritual', label: 'Espiritual (Tu Alma)', icon: Sparkles }
              ].map((dim) => {
                const score = result.scores[dim.key] || 1;
                const percentage = (score / 5) * 100;
                const status = getLabelAndColor(score);
                const Icon = dim.icon;

                return (
                  <div key={dim.key} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 print-break-inside-avoid">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2 text-gray-700 font-serif text-lg">
                        <Icon size={18} className="text-[#B76E79]" />
                        <span>{dim.label}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${status.text} ${status.color.replace('bg-', 'bg-').replace('400', '100')}`}>
                        {status.label} ({score}/5)
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${status.color}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lowest Dimension Focus Area */}
            <div className="bg-gradient-to-br from-[#fdf6f6] to-[#faebeb] border border-[#F9C8C8] rounded-3xl p-8 sm:p-10 relative overflow-hidden print-break-inside-avoid">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-[#B76E79]">
                <Leaf size={120} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-[#B76E79] mb-6 flex items-center">
                  <span className="bg-white/80 p-2 rounded-full mr-3 shadow-sm text-[#D4AF37]">
                    <Sparkles size={24} />
                  </span>
                  Un abrazo para tu Dimensión {result.lowestDimension}
                </h3>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic font-light border-l-4 border-[#D4AF37] pl-4">
                  "{result.empatheticMessage}"
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
                    <h4 className="font-semibold text-[#B76E79] flex items-center mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2"></span>
                      Hábito Fundamental
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.fundamentalHabit}</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
                    <h4 className="font-semibold text-[#B76E79] flex items-center mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2"></span>
                      Microhábito (Para hoy)
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.microHabit}</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Actions / CTA (Hidden in print) */}
          <div className="bg-white border-t border-gray-100 p-8 sm:px-12 pb-12 text-center no-print">
            <p className="text-gray-500 mb-6 text-sm">
              Descarga este resultado y envíamelo por WhatsApp para trazar tu ruta.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition-colors w-full sm:w-auto"
              >
                <Download size={18} className="mr-2" />
                📥 Descargar mi Mapa en PDF
              </button>

              <a
                href="https://wa.link/fuairu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 py-3 text-white bg-[#B76E79] hover:bg-[#a25e68] rounded-full font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto hover:-translate-y-1"
              >
                <MessageCircle size={20} className="mr-2" />
                Demos el primer paso juntas 🤍
              </a>
            </div>
            
            {printMessage && (
              <div className="mt-4 text-center">
                <p className="text-sm text-[#B76E79] font-medium bg-[#F9C8C8]/30 py-2 px-4 rounded-full inline-block">
                  {printMessage}
                </p>
              </div>
            )}
            
            <button 
              onClick={() => setStep(1)}
              className="mt-8 text-sm text-gray-400 hover:text-[#B76E79] underline underline-offset-4 transition-colors"
            >
              Volver a evaluar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}