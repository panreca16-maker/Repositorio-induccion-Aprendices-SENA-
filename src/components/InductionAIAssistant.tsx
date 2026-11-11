import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';
import { SENA_LOGO_SVG } from '../data/senaData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  articleRef?: string;
  timestamp: string;
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string; ref: string }[] = [
  {
    keywords: ['falto', 'inasistencia', 'ausencia', 'falta', '3 dias', 'justificar', 'medica'],
    answer: 'De acuerdo con el Reglamento del Aprendiz (Capítulo IV), tienes un plazo máximo de tres (3) días hábiles siguientes al hecho para radicar formalmente tu justificación médica (expedida por EPS) o de fuerza mayor ante tu instructor y coordinación académica. Si acumulas 3 días consecutivos de inasistencia injustificada, se iniciará el proceso de reporte por posible deserción.',
    ref: 'Reglamento del Aprendiz · Capítulo IV y Procedimiento de Deserción'
  },
  {
    keywords: ['plagio', 'copia', 'fraude', 'suplantar', 'suplantacion'],
    answer: 'El plagio y la suplantación de identidad en evaluaciones o evidencias constituyen Faltas Graves o Gravísimas según el artículo de Prohibiciones (Art. 9). Conducen a la anulación de la evidencia, llamado ante el Comité de Evaluación y Seguimiento, y pueden acarrear la cancelación de la matrícula con inhabilidad temporal para matricularse en el SENA.',
    ref: 'Reglamento del Aprendiz · Art. 9 (Prohibiciones) y Cap. VIII (Faltas)'
  },
  {
    keywords: ['carne', 'carnet', 'talanquera', 'porteria', 'ingreso', 'uniforme'],
    answer: 'Portar el carné institucional en lugar visible durante el ingreso, permanencia y salida del centro de formación es un deber reglamentario ineludible (Art. 8). El carné es estrictamente personal e intransferible; prestarlo para permitir el ingreso de un tercero está tipificado como falta disciplinaria grave.',
    ref: 'Reglamento del Aprendiz · Art. 8 (Deberes) y Art. 9 (Prohibiciones)'
  },
  {
    keywords: ['contrato', 'aprendizaje', 'etapa productiva', 'sueldo', 'pasantia', 'alternativas'],
    answer: 'El SENA reconoce 6 alternativas oficiales para la Etapa Productiva: Contrato de Aprendizaje, Proyecto Productivo (Fondo Emprender), Pasantía, Vínculo Laboral, Monitorías y Apoyo a ONGs. En el Contrato de Aprendizaje durante la etapa lectiva recibes mínimo el 50% de un SMLMV más afiliación a EPS; en la etapa productiva asciende al 75% o 100% de un SMLMV más afiliación a ARL.',
    ref: 'Ley 789 de 2002 y Acuerdo Institucional de Etapa Productiva'
  },
  {
    keywords: ['fundador', 'historia', 'quien fundo', '1957', 'creacion', 'origen', 'rodolfo'],
    answer: 'El SENA fue fundado el 21 de junio de 1957 mediante el Decreto Ley 118 por iniciativa del economista y jurista cartagenero Rodolfo Martínez Tono, con el apoyo de la Organización Internacional del Trabajo (OIT) y los gremios de la producción nacional (ANDI, Fenalco).',
    ref: 'Historia Institucional SENA · Decreto Ley 118 de 1957'
  },
  {
    keywords: ['escudo', 'simbolos', 'bandera', 'himno', 'logo', 'verde', 'blanco'],
    answer: 'Los símbolos del SENA son: el Escudo (representa los sectores Primario -café-, Secundario -engranaje- y Terciario -caduceo-), la Bandera (fondo blanco de paz y escudo verde de esperanza), el Logo-símbolo (aprendiz en marcha hacia el futuro sobre caminos de formación) y el Himno oficial (letra de Luis Alfredo Sánchez, música de Daniel Marlez).',
    ref: 'Manual de Imagen e Identidad Corporativa SENA'
  },
  {
    keywords: ['apoyo', 'sostenimiento', 'subsidio', 'dinero', 'bienestar', 'psicologia', 'fic'],
    answer: 'Bienestar al Aprendiz gestiona los Apoyos de Sostenimiento Regular y Apoyos FIC (Fondo de la Construcción) para aprendices de estratos 1 y 2 que cumplan requisitos académicos y socioeconómicos. Asimismo, brinda orientación psicológica gratuita y confidencial para cuidar tu salud mental.',
    ref: 'Plan Nacional de Bienestar al Aprendiz SENA'
  }
];

export const InductionAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: '¡Hola! Soy tu Tutor Virtual de Inducción SENA. Puedo resolver cualquier inquietud sobre la normativa institucional, el Reglamento del Aprendiz, los símbolos patrios o las alternativas de etapa productiva. ¿Qué deseas consultar hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Ahora'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      // Find best match in knowledge base
      const lower = textToSend.toLowerCase();
      const matched = KNOWLEDGE_BASE.find(kb =>
        kb.keywords.some(k => lower.includes(k))
      );

      let responseText = '';
      let refText: string | undefined = undefined;

      if (matched) {
        responseText = matched.answer;
        refText = matched.ref;
      } else {
        responseText = `Sobre tu consulta: En el SENA todo proceso se rige por el principio de "Primero la vida", la dignidad del ser humano y el Reglamento del Aprendiz. Te recomendamos concertar directamente con tu instructor de ficha o acudir a la Coordinación Académica de tu centro para recibir orientación personalizada según tu caso.`;
        refText = 'Reglamento del Aprendiz · Principios Rectores';
      }

      const botMsg: ChatMessage = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: responseText,
        articleRef: refText,
        timestamp: 'Ahora'
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const sampleQueries = [
    '¿Qué pasa si falto 3 días seguidos a clase?',
    '¿Cuáles son las alternativas de etapa productiva?',
    '¿Qué significa el engranaje del escudo?',
    '¿Qué sanciones existen por plagio?'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col h-[650px] shadow-xs">
        {/* Header */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-1 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <img
                src={SENA_LOGO_SVG}
                alt="Logo SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Tutor Virtual de Inducción SENA</span>
                <span className="text-[10px] text-[#39A900] font-mono font-medium">Asesor Normativo</span>
              </h3>
              <p className="text-[11px] text-neutral-500">
                Basado en el Reglamento del Aprendiz (Acuerdo 007 de 2012)
              </p>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'tutor';

            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-emerald-50 dark:bg-emerald-950/40 p-0.5' : 'bg-neutral-800 text-white'
                }`}>
                  {isBot ? (
                    <img
                      src={SENA_LOGO_SVG}
                      alt="Tutor SENA"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                <div className={`p-4 rounded-xl max-w-lg border ${
                  isBot
                    ? 'bg-neutral-50 dark:bg-neutral-850 border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                    : 'bg-[#39A900] text-white border-transparent'
                }`}>
                  <p>{m.text}</p>
                  {m.articleRef && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-700/80 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                      Fundamento: {m.articleRef}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 pl-10">
              <span className="animate-pulse">Consultando compendio normativo SENA...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="p-3 bg-neutral-50/70 dark:bg-neutral-850/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-neutral-400 shrink-0 font-medium">Sugeridas:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-[#39A900] text-neutral-600 dark:text-neutral-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
          <input
            type="text"
            placeholder="Pregúntale al tutor sobre deberes, faltas, contratos o historia..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 py-2 px-3.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="p-2.5 bg-[#39A900] hover:bg-[#329600] text-white rounded-lg transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
