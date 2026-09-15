import React, { useState, useEffect } from 'react';
import { diaryCases } from '../data/diaryCases.data';

interface Props {
  viewMode: 'board' | 'list';
  onViewModeChange: (mode: 'board' | 'list') => void;
}

const HUDOverlay: React.FC<Props> = ({ viewMode, onViewModeChange }) => {
  const [legendOpen, setLegendOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  // Auto-hide floating top-left title badge when scrolling down, show when scrolling up
  useEffect(() => {
    let lastY = 0;
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      const currentY =
        target === document || target === document.body
          ? window.scrollY
          : (target as HTMLElement).scrollTop || 0;

      if (currentY <= 20) {
        setVisible(true);
      } else if (currentY > lastY + 8) {
        // Scrolling down -> hide badge
        setVisible(false);
      } else if (currentY < lastY - 8) {
        // Scrolling up -> show badge
        setVisible(true);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  return (
    <>
      {/* Top-left: Title badge (Auto-hides smoothly on scroll down) */}
      <div
        className={`fixed top-3 left-3 sm:top-5 sm:left-5 z-40 select-none max-w-[150px] sm:max-w-none transition-all duration-300 transform ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0 pointer-events-none'
        }`}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <div
          className="p-1.5 sm:p-2.5 shadow-lg"
          style={{
            background: 'rgba(10,8,6,0.88)',
            border: '1px solid rgba(204,17,17,0.6)',
            backdropFilter: 'blur(8px)',
            borderLeft: '3px solid #CC1111',
          }}
        >
          <div
            className="text-[9px] sm:text-[10px]"
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#CC1111',
              marginBottom: '1px',
            }}
          >
            ✎ SHEILA LAYALIA
          </div>
          <div
            className="text-[12px] sm:text-[15px]"
            style={{
              fontFamily: '"Special Elite", serif',
              color: '#F5E8CC',
              letterSpacing: '0.5px',
            }}
          >
            Pragmatics Diary
          </div>
          <div
            className="hidden sm:block"
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: '8px',
              color: '#7A6A5A',
              letterSpacing: '2px',
              marginTop: '2px',
            }}
          >
            INTERACTIVE CASE STUDY BOARD — 2026
          </div>
        </div>
      </div>

      {/* Top-right: View Switcher Toggle (iPad / Tablet only) */}
      <div className="hidden md:flex lg:hidden fixed top-5 right-5 z-40 items-center gap-1 p-1 bg-[#0A0806]/90 border border-[#CC1111]/60 backdrop-blur-md rounded-xs shadow-lg">
        <button
          onClick={() => onViewModeChange('board')}
          className={`px-2.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-all rounded-xs ${
            viewMode === 'board'
              ? 'bg-[#CC1111] text-white shadow-md'
              : 'text-[#8A7A6A] hover:text-[#F5E8CC]'
          }`}
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          📌 BOARD
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-2.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-all rounded-xs ${
            viewMode === 'list'
              ? 'bg-[#CC1111] text-white shadow-md'
              : 'text-[#8A7A6A] hover:text-[#F5E8CC]'
          }`}
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          📑 CASE LIST
        </button>
      </div>

      {/* Bottom-left: Legend toggle (Only shown in board view) */}
      {viewMode === 'board' && (
        <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40">
          <button
            id="legend-toggle-btn"
            onClick={() => setLegendOpen((v) => !v)}
            style={{
              background: 'rgba(10,8,6,0.88)',
              border: '1px solid rgba(204,17,17,0.5)',
              backdropFilter: 'blur(8px)',
              padding: '7px 12px',
              fontFamily: 'Oswald, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#CC1111',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {legendOpen ? '▼ LEGEND' : '▶ LEGEND'}
          </button>

          {legendOpen && (
            <div
              className="animate-slideUp max-w-[240px]"
              style={{
                background: 'rgba(10,8,6,0.92)',
                border: '1px solid rgba(204,17,17,0.35)',
                backdropFilter: 'blur(8px)',
                padding: '10px 14px',
                marginTop: '4px',
              }}
            >
              {[
                { colour: '#CC1111', label: 'Red thread — evidence link' },
                { colour: '#8B0000', label: 'CONFIDENTIAL case' },
                { colour: '#1a3a6e', label: 'Evidence log' },
                { colour: '#145214', label: 'Solved case' },
                { colour: '#CC8800', label: 'Open / active case' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: item.colour,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Courier Prime", monospace',
                      fontSize: '10px',
                      color: '#B8A888',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px dashed rgba(204,17,17,0.3)',
                  fontFamily: '"Courier Prime", monospace',
                  fontSize: '9px',
                  color: '#5A4A3A',
                }}
              >
                CLICK ANY CARD TO OPEN DOSSIER
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom-right: Hint */}
      {viewMode === 'board' && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 select-none hidden sm:block"
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: '10px',
              color: 'rgba(122,106,90,0.7)',
              textAlign: 'right',
              letterSpacing: '1px',
            }}
          >
            HOVER · CLICK TO READ FULL DIARY ENTRY
          </div>
        </div>
      )}
    </>
  );
};

export default HUDOverlay;
