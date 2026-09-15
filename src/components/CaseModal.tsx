import React, { useEffect, useRef } from 'react';
import { DiaryCase } from '../types';

interface Props {
  selected: DiaryCase | null;
  onClose: () => void;
}

const STAMP_COLOURS: Record<string, string> = {
  'EVIDENCE LOG': '#1a3a6e',
  'CONFIDENTIAL': '#8B0000',
  'SOLVED': '#145214',
  'OPEN': '#7a4a00',
};

const CaseModal: React.FC<Props> = ({ selected, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  if (!selected) return null;

  const stampColour = STAMP_COLOURS[selected.stampType] ?? '#8B0000';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Dossier Container */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp rounded-sm"
        style={{
          background: 'linear-gradient(160deg, #F5EDD8 0%, #EDE0C4 40%, #E8D8B8 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(139,92,20,0.3)',
          fontFamily: '"Courier Prime", monospace',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top classification bar */}
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{ background: '#1a1a1a', borderBottom: '3px solid #CC1111' }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: '#CC1111', fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
          >
            📁 PRAGMATICS CASE FILE — RESEARCH LOG
          </span>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none ml-4"
            aria-label="Close dossier"
          >
            ✕
          </button>
        </div>

        <div className="px-8 pt-6 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="text-xs tracking-widest mb-1 uppercase"
                style={{ color: '#8B0000', fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}
              >
                {selected.category}
              </div>
              <h2
                className="text-2xl font-bold leading-tight mb-1"
                style={{ fontFamily: '"Special Elite", serif', color: '#1a1210' }}
              >
                {selected.title}
              </h2>
              <div className="text-xs text-gray-500 tracking-wider">
                {selected.caseNumber} &nbsp;|&nbsp; {selected.date}
              </div>
            </div>

            {/* Stamp badge */}
            <div
              className="flex-shrink-0 ml-4 animate-stamp_in"
              style={{
                border: `2.5px solid ${stampColour}`,
                color: stampColour,
                transform: 'rotate(-12deg)',
                padding: '4px 12px',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '3px',
                whiteSpace: 'nowrap',
                opacity: 0.85,
              }}
            >
              {selected.stampType}
            </div>
          </div>

          {/* Divider */}
          {(selected.excerpt || selected.content || selected.imageUrl) && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: '#BBA87A' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#CC1111' }} />
              <div className="flex-1 h-px" style={{ background: '#BBA87A' }} />
            </div>
          )}

          {/* Case excerpt callout */}
          {selected.excerpt && (
            <blockquote
              className="border-l-4 pl-4 mb-6 italic text-sm leading-relaxed"
              style={{ borderColor: '#CC1111', color: '#3a2a1a' }}
            >
              {selected.excerpt}
            </blockquote>
          )}

          {/* Photo before content ("I remember...") */}
          {selected.imageUrl && (
            <div className="mb-4 flex flex-col items-center">
              <div
                className="relative p-1.5 bg-[#FAF6EE] border border-[#C8B896] rounded-sm shadow-md"
                style={{
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.12)',
                }}
              >
                {/* Vintage evidence tape */}
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-[#EAE2CE]/90 border border-[#D0C4A8]/70 rotate-[-1deg]"
                  style={{ backdropFilter: 'blur(1px)' }}
                />
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="max-h-[175px] max-w-[200px] w-auto object-contain rounded-sm"
                />
              </div>
              {/* Caption / Source underneath photo */}
              {selected.imageCaption && (
                <div
                  className="mt-1.5 text-xs text-[#5A4A3A] italic tracking-wide text-center"
                  style={{ fontFamily: '"Courier Prime", monospace' }}
                >
                  {selected.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Full content */}
          {selected.content && (
            <div
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: '#2a1e10', lineHeight: '1.75' }}
            >
              {selected.content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={idx} style={{ fontWeight: 800, color: '#000000' }}>
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <em key={idx} style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                      {part.slice(1, -1)}
                    </em>
                  );
                }
                return part;
              })}
            </div>
          )}

          {/* Footer metadata */}
          <div
            className="mt-8 pt-4 flex flex-wrap gap-4 text-xs"
            style={{ borderTop: '1px dashed #BBA87A', color: '#7A6A5A' }}
          >
            <span>FILE: {selected.caseNumber.replace('CASE ', 'FILE-')}</span>
            <span>STATUS: <strong style={{ color: stampColour }}>{selected.stampType}</strong></span>
            <span>DATE LOGGED: {selected.date}</span>
          </div>

          {/* Bottom classification */}
          <div
            className="mt-4 text-center text-xs tracking-widest uppercase py-2"
            style={{
              background: '#1a1a1a',
              color: '#CC1111',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              margin: '0 -32px -32px',
              borderTop: '2px solid #CC1111',
            }}
          >
            END OF CASE STUDY — LINGUISTIC ANALYSIS
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseModal;
