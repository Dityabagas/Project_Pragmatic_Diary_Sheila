import React from 'react';
import { DiaryCase } from '../types';
import { diaryCases } from '../data/diaryCases.data';

interface Props {
  onCaseSelect: (c: DiaryCase) => void;
}

const STAMP_COLOURS: Record<string, string> = {
  'EVIDENCE LOG': '#1a3a6e',
  'CONFIDENTIAL': '#8B0000',
  'SOLVED': '#145214',
  'OPEN': '#7a4a00',
  'CLOSED': '#555555',
};

const CaseListView: React.FC<Props> = ({ onCaseSelect }) => {
  return (
    <div
      className="w-full h-full overflow-y-auto pt-24 pb-16 px-4 sm:px-8 max-w-6xl mx-auto"
      style={{
        background: 'radial-gradient(circle at center, #242422 0%, #151513 100%)',
      }}
    >
      {/* Top Header Banner */}
      <div className="text-center mb-8 animate-fadeIn">
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-3 text-xs sm:text-sm font-bold tracking-widest uppercase bg-[#1a1a1a] text-[#CC1111] border border-[#CC1111]/40 border-b-2 border-b-[#CC1111] rounded-xs shadow-md"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          <span>📁</span>
          <span>PRAGMATICS CASE FILE — RESEARCH LOG</span>
        </div>
        <h1
          className="text-2xl sm:text-4xl font-bold text-[#F5E8CC] tracking-wide"
          style={{ fontFamily: '"Special Elite", serif' }}
        >
          Sheila's Pragmatics Diary
        </h1>
        <p
          className="text-xs text-[#9A8A7A] mt-2 tracking-wider max-w-md mx-auto"
          style={{ fontFamily: '"Courier Prime", monospace' }}
        >
          TAP ANY CASE FILE BELOW TO READ FULL INVESTIGATION LOG
        </p>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
        {diaryCases.map((caseItem, idx) => {
          const stampColour = STAMP_COLOURS[caseItem.stampType] ?? '#8B0000';
          const cardImg = caseItem.cardImageUrl || caseItem.imageUrl;

          return (
            <div
              key={caseItem.id}
              onClick={() => onCaseSelect(caseItem)}
              className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] hover:shadow-2xl rounded-sm p-5 sm:p-6 animate-slideUp"
              style={{
                background: 'linear-gradient(155deg, #FAF4E6 0%, #EDE2C8 100%)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 0 1px rgba(187,168,122,0.4)',
                fontFamily: '"Courier Prime", monospace',
                animationDelay: `${idx * 70}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Red Push Pin */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-800 shadow-md border border-red-300 flex items-center justify-center z-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.5)' }}
              >
                <div className="w-2 h-2 rounded-full bg-red-300/80" />
              </div>

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
                    transform: 'rotate(-6deg)',
                    fontFamily: 'Oswald, sans-serif',
                  }}
                >
                  {caseItem.stampType}
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-lg font-bold text-[#1a1210] leading-snug mb-2 group-hover:text-red-900 transition-colors"
                style={{ fontFamily: '"Special Elite", serif' }}
              >
                {caseItem.title}
              </h2>

              {/* Image Preview if available */}
              {cardImg && (
                <div className="my-3 overflow-hidden rounded-xs border border-[#C8B896] bg-[#FAF6EE] p-1 shadow-inner">
                  <img
                    src={cardImg}
                    alt={caseItem.title}
                    className="w-full h-32 sm:h-36 object-contain rounded-xs"
                  />
                </div>
              )}

              {/* Content Preview / Excerpt */}
              <p className="text-xs text-[#3a2e20] leading-relaxed line-clamp-3 mb-4">
                {caseItem.excerpt || caseItem.content}
              </p>

              {/* Card Footer */}
              <div className="pt-3 border-t border-dashed border-[#C8B896] flex items-center justify-between text-[11px] text-[#6A5A4A]">
                <span>{caseItem.date}</span>
                <span className="font-bold text-red-900 group-hover:underline flex items-center gap-1">
                  READ DOSSIER →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseListView;
