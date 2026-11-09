import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DiaryCase } from '../types';
import { diaryCases } from '../data/diaryCases.data';
import { STAMP_COLOURS } from '../constants/theme';

interface Props {
  onCaseSelect: (c: DiaryCase) => void;
}

const FULL_TITLE = "Sheila's Pragmatics Diary";

const CaseListView: React.FC<Props> = ({ onCaseSelect }) => {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect with mechanical keystroke rhythm & replay support
  const startTypewriter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedTitle('');
    setIsDoneTyping(false);

    let index = 0;
    const typeNextChar = () => {
      if (index < FULL_TITLE.length) {
        index++;
        setDisplayedTitle(FULL_TITLE.slice(0, index));
        const char = FULL_TITLE[index - 1];
        // Mechanical typing cadence (natural variance + pauses on spaces)
        const delay = char === ' ' ? 110 : 50 + Math.random() * 35;
        timerRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsDoneTyping(true);
      }
    };

    timerRef.current = setTimeout(typeNextChar, 180);
  }, []);

  useEffect(() => {
    startTypewriter();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTypewriter]);

  return (
    <div
      className="w-full h-full overflow-y-auto pt-24 pb-16 px-4 sm:px-8 max-w-6xl mx-auto"
      style={{
        background: 'radial-gradient(circle at center, #242422 0%, #151513 100%)',
      }}
    >
      {/* Top Header Banner */}
      <div className="text-center mb-8 animate-fadeIn flex flex-col items-center">
        {/* Row 1: Case file badge */}
        <div className="mb-3">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold tracking-widest uppercase bg-[#1a1a1a] text-[#CC1111] border border-[#CC1111]/40 border-b-2 border-b-[#CC1111] rounded-xs shadow-md select-none"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <span>📁</span>
            <span>PRAGMATICS CASE FILE — RESEARCH LOG</span>
          </div>
        </div>

        {/* Row 2: Headline with typewriter animation */}
        <div className="w-full flex justify-center items-center my-1">
          <h1
            onClick={startTypewriter}
            title="Klik untuk ketik ulang"
            className="cursor-pointer select-none text-2xl sm:text-4xl font-bold text-[#F5E8CC] tracking-wide min-h-[36px] sm:min-h-[44px] inline-flex items-center justify-center transition-colors duration-200 hover:text-white"
            style={{
              fontFamily: '"Special Elite", serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            <span>{displayedTitle}</span>
            <span
              className="inline-block w-[3px] sm:w-[4px] h-[1.1em] bg-[#CC1111] ml-1.5 align-middle anim-cursor-blink"
              style={{
                boxShadow: '0 0 8px rgba(204, 17, 17, 0.8)',
              }}
              aria-hidden="true"
            />
          </h1>
        </div>

        {/* Row 3: Subtitle instruction */}
        <p
          className="text-xs text-[#9A8A7A] mt-2 tracking-wider max-w-md mx-auto"
          style={{ fontFamily: '"Courier Prime", monospace' }}
        >
          SELECT ANY CASE FILE BELOW TO INSPECT FULL INVESTIGATION LOG
        </p>
      </div>

      {/* Case Cards Grid: 7 Balanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pb-12">
        {diaryCases.map((caseItem, idx) => {
          const stampColour = STAMP_COLOURS[caseItem.stampType] ?? '#8B0000';
          const cardImg = caseItem.cardImageUrl || caseItem.imageUrl;
          const isOpen = caseItem.stampType === 'OPEN';

          return (
            <div
              key={caseItem.id}
              onClick={() => onCaseSelect(caseItem)}
              className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] hover:shadow-2xl rounded-sm p-5 sm:p-6 flex flex-col justify-between animate-slideUp"
              style={{
                background: 'linear-gradient(155deg, #FAF4E6 0%, #EDE2C8 100%)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 0 1px rgba(187,168,122,0.4)',
                fontFamily: '"Courier Prime", monospace',
                animationDelay: `${idx * 80}ms`,
                animationFillMode: 'both',
                minHeight: '380px',
              }}
            >
              {/* Red Push Pin */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-800 shadow-md border border-red-300 flex items-center justify-center z-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.5)' }}
              >
                <div className="w-2 h-2 rounded-full bg-red-300/80" />
              </div>

              {/* Card Top Section */}
              <div>
                {/* Card Header: Case # & Stamp */}
                <div className="flex items-start justify-between mb-3 mt-1">
                  <div>
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase block text-red-900"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {caseItem.category}
                    </span>
                    <span className="text-xs text-amber-900/70 font-semibold tracking-wider">
                      {caseItem.caseNumber}
                    </span>
                  </div>

                  {/* Stamp */}
                  <div
                    className="text-[10px] font-bold tracking-widest px-2 py-0.5 border"
                    style={{
                      borderColor: stampColour,
                      color: stampColour,
                      transform: 'rotate(-5deg)',
                      fontFamily: 'Oswald, sans-serif',
                    }}
                  >
                    {caseItem.stampType}
                  </div>
                </div>

                {/* Title */}
                <h2
                  className="text-base sm:text-lg font-bold text-[#1a1210] leading-snug mb-2.5 min-h-[48px] line-clamp-2 group-hover:text-red-900 transition-colors"
                  style={{ fontFamily: '"Special Elite", serif' }}
                >
                  {caseItem.title}
                </h2>

                {/* Image Section (Fixed height for perfectly uniform cards) */}
                <div className="my-3 overflow-hidden rounded-xs border border-[#C8B896] bg-[#FAF6EE] shadow-inner h-32 sm:h-36 flex items-center justify-center">
                  {cardImg ? (
                    <img
                      src={cardImg}
                      alt={caseItem.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#EADBBE]/50 border border-dashed border-[#B8A888]/60">
                      <span className="text-2xl mb-1 opacity-70">🔒</span>
                      <span
                        className="text-[10px] tracking-[2px] font-bold text-[#7A6A5A] uppercase"
                        style={{ fontFamily: 'Oswald, sans-serif' }}
                      >
                        CONFIDENTIAL DOSSIER
                      </span>
                      <span className="text-[9px] text-[#8A7A6A] font-mono mt-0.5 tracking-wider">
                        AWAITING FIELD NOTES
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Preview / Excerpt */}
                <p className="text-xs text-[#3a2e20] leading-relaxed line-clamp-3 mb-3">
                  {caseItem.excerpt || caseItem.content}
                </p>
              </div>

              {/* Card Bottom / Footer */}
              <div className="pt-3 border-t border-dashed border-[#C8B896] flex items-center justify-between text-[11px] text-[#6A5A4A] mt-auto">
                <span className="font-mono text-[10px] tracking-wide">{caseItem.date}</span>
                {isOpen ? (
                  <span className="font-bold text-red-900 group-hover:underline flex items-center gap-1 tracking-wider text-[11px]">
                    READ DOSSIER →
                  </span>
                ) : (
                  <span className="font-semibold text-[#8A7A6A] flex items-center gap-1 tracking-wider text-[11px]">
                    SEALED FILE 🔒
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseListView;
