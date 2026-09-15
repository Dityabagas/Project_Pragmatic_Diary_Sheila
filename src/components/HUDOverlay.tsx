import React, { useState } from 'react';

const HUDOverlay: React.FC = () => {
  const [legendOpen, setLegendOpen] = useState(false);

  return (
    <>
      {/* Top-left: Title badge */}
      <div
        className="fixed top-5 left-5 z-40 select-none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(10,8,6,0.88)',
            border: '1px solid rgba(204,17,17,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '10px 18px',
            borderLeft: '4px solid #CC1111',
          }}
        >
          <div
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '4px',
              color: '#CC1111',
              marginBottom: '2px',
            }}
          >
            ⚠ CASE STUDY BOARD
          </div>
          <div
            style={{
              fontFamily: '"Special Elite", serif',
              fontSize: '18px',
              color: '#F5E8CC',
              letterSpacing: '1px',
            }}
          >
            Sheila Layalia
          </div>
          <div
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: '9px',
              color: '#7A6A5A',
              letterSpacing: '2px',
              marginTop: '2px',
            }}
          >
            INTERACTIVE DIARY
          </div>
        </div>
      </div>

      {/* Bottom-left: Legend toggle */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          id="legend-toggle-btn"
          onClick={() => setLegendOpen((v) => !v)}
          style={{
            background: 'rgba(10,8,6,0.88)',
            border: '1px solid rgba(204,17,17,0.5)',
            backdropFilter: 'blur(8px)',
            padding: '8px 14px',
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
            className="animate-slideUp"
            style={{
              background: 'rgba(10,8,6,0.92)',
              border: '1px solid rgba(204,17,17,0.35)',
              backdropFilter: 'blur(8px)',
              padding: '12px 16px',
              marginTop: '4px',
              minWidth: '200px',
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
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
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
                marginTop: '8px',
                paddingTop: '8px',
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

      {/* Bottom-right: Hint */}
      <div
        className="fixed bottom-5 right-5 z-40 select-none"
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
          HOVER · CLICK TO READ FULL CASE FILE
        </div>
      </div>
    </>
  );
};

export default HUDOverlay;
