import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: (targetMode?: 'board' | 'list') => void;
}

const ClosingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
    }
  }, [isOpen]);

  // Track mobile view (<768px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleActionClick(isMobile ? 'list' : undefined);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, isMobile]);

  const handleActionClick = (targetMode?: 'board' | 'list') => {
    setIsAnimatingOut(true);
    // On mobile, strictly route to list
    const finalTarget = isMobile ? 'list' : targetMode;
    setTimeout(() => {
      onClose(finalTarget);
      setShouldRender(false);
    }, 400);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-out ${
        isAnimatingOut
          ? 'opacity-0 backdrop-blur-none pointer-events-none'
          : 'opacity-100 backdrop-blur-md bg-black/75'
      }`}
      style={{
        backdropFilter: isAnimatingOut ? 'blur(0px)' : 'blur(10px)',
        WebkitBackdropFilter: isAnimatingOut ? 'blur(0px)' : 'blur(10px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleActionClick(isMobile ? 'list' : undefined);
      }}
    >
      {/* Background vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />

      {/* Outer Card Wrapper (overflow-visible with pt-4 ensures top pushpin is never clipped) */}
      <div
        className={`relative w-full max-w-[500px] pt-4 my-auto transition-all duration-450 ease-out transform ${
          isAnimatingOut ? 'scale-95 translate-y-3 opacity-0' : 'anim-memo-card'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Red Pushpin decoration (Placed outside scroll container, perfectly visible) */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center anim-pin-drop pointer-events-none">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border border-red-400"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ff4d4d, #b30000 70%, #590000)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>

        {/* Scrollable Dossier Card Body */}
        <div
          className="relative w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-sm shadow-2xl border"
          style={{
            background: 'linear-gradient(150deg, #181512 0%, #0d0c0a 100%)',
            borderColor: 'rgba(204, 17, 17, 0.45)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 30px rgba(204,17,17,0.18)',
          }}
        >
          {/* Top header badge */}
          <div className="flex items-center justify-between border-b border-[#3a3028] pb-3 mb-3 mt-1 anim-closing-badge">
            <span
              className="text-[10px] sm:text-[11px] tracking-[2px] font-bold text-[#CC1111] uppercase"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              📁 Final Dossier // Investigation Epilogue
            </span>
            <button
              onClick={() => handleActionClick(isMobile ? 'list' : undefined)}
              className="text-[#8A7A6A] hover:text-white transition-colors cursor-pointer text-lg leading-none"
              aria-label="Close dossier"
            >
              ✕
            </button>
          </div>

          {/* Mini-Stat Achievement Badge */}
          <div className="flex items-center justify-center mb-3 anim-closing-badge">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[1.5px] uppercase"
              style={{
                background: 'rgba(204, 17, 17, 0.12)',
                border: '1px solid rgba(204, 17, 17, 0.45)',
                color: '#FF8888',
                fontFamily: 'Oswald, sans-serif',
                boxShadow: '0 0 10px rgba(204,17,17,0.2)',
              }}
            >
              <span>✦ 7/7 CASES INVESTIGATED // REFLECTION COMPLETE ✦</span>
            </div>
          </div>

          {/* Headline & CASE CLOSED Red Ink Stamp */}
          <div className="flex items-start justify-between relative mb-4 gap-2">
            <h2
              className="text-xl sm:text-2xl text-[#F5E8CC] font-bold tracking-wide leading-tight anim-closing-headline"
              style={{ fontFamily: '"Special Elite", serif' }}
            >
              YOU’VE REACHED THE END OF THE ENTRIES! 🎉
            </h2>

            {/* Red Ink Stamp: CASE CLOSED with Stamp Slam animation */}
            <div className="pointer-events-none select-none flex-shrink-0 anim-closing-stamp">
              <div
                className="px-2.5 py-1 border-2 border-dashed border-[#CC1111] text-[#CC1111] rounded-xs font-bold tracking-[2px] text-[10px] sm:text-[11px] uppercase bg-[#CC1111]/15 rotate-[-8deg]"
                style={{
                  fontFamily: 'Oswald, sans-serif',
                  boxShadow: '0 0 12px rgba(204,17,17,0.3)',
                  textShadow: '0 0 4px rgba(204,17,17,0.5)',
                }}
              >
                CASE CLOSED
              </div>
            </div>
          </div>

          {/* Body Text with Staggered Fade & Redaction Wipe */}
          <div
            className="space-y-3.5 text-[13px] sm:text-[14px] leading-relaxed text-[#D0C2B0]"
            style={{ fontFamily: '"Courier Prime", monospace' }}
          >
            <p className="text-[#FF7777] font-bold tracking-wide anim-closing-congrats">
              Congratulations, and thank you for reading!
            </p>

            <p className="anim-closing-para1">
              Through these entries, we discovered how{' '}
              <span className="relative inline-block px-1 mx-0.5 font-semibold text-[#FF5252] bg-black/40 rounded-xs">
                pragmatics
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-closing-redact-1 rounded-xs pointer-events-none"
                  style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
                />
              </span>{' '}
              is part of our everyday lives, from understanding hidden meanings to interpreting other people’s words.
            </p>

            <p className="anim-closing-para2">
              This project has taught me that language is not just about what we say, but also{' '}
              <strong className="relative inline-block px-1 mx-0.5 font-bold text-[#F5E8CC] bg-black/40 rounded-xs">
                what we mean
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-closing-redact-2 rounded-xs pointer-events-none"
                  style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
                />
              </strong>{' '}
              and how others understand it.
            </p>

            {/* Detective Clue Callout Box */}
            <div
              className="p-3.5 rounded-xs my-3 border-l-3 border-[#CC1111] anim-closing-callout"
              style={{
                background: 'rgba(204, 17, 17, 0.08)',
                borderWidth: '1px 1px 1px 3px',
                borderColor: 'rgba(204, 17, 17, 0.35) rgba(204, 17, 17, 0.2) rgba(204, 17, 17, 0.2) #CC1111',
              }}
            >
              <div
                className="text-[#CC1111] font-bold text-xs uppercase tracking-[2px] mb-1"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                BUT WAIT…
              </div>
              <p className="text-[#F5E8CC] text-[13px] sm:text-[13.5px] italic">
                Have you ever noticed pragmatics in your own daily life? Maybe it’s time to start paying more attention!
              </p>
            </div>

            {/* Closing punchline */}
            <div className="pt-2 flex items-center justify-between border-t border-[#3a3028]/60 anim-closing-punchline">
              <span
                className="text-[#CC1111] font-bold tracking-[2px] text-xs sm:text-sm uppercase"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                CASE CLOSED! 🔎
              </span>
              <span
                className="text-[#A69582] text-xs italic"
                style={{ fontFamily: '"Special Elite", serif' }}
              >
                Thank you for joining this little journey. ♡
              </span>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-5 pt-3 border-t border-[#3a3028]/80 text-[13px] text-[#A69582] anim-closing-sign">
            <div className="italic" style={{ fontFamily: '"Special Elite", serif' }}>
              Warm regards,
            </div>
            <div
              className="mt-0.5"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              <span className="relative inline-block px-1 text-[#F5E8CC] font-bold text-[15px] tracking-wide bg-black/40 rounded-xs">
                Sheila Layalia
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-closing-redact-3 rounded-xs pointer-events-none"
                  style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
                />
              </span>
            </div>
          </div>

          {/* Navigation Action Buttons (UX Loop: Adaptive for Mobile vs Desktop) */}
          <div className="mt-6 pt-4 border-t border-[#3a3028] anim-closing-actions">
            {isMobile ? (
              /* Mobile User: Single Clear Full-width Action returning to Case List */
              <button
                type="button"
                onClick={() => handleActionClick('list')}
                className="w-full py-3.5 px-4 rounded-xs transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-lg select-none"
                style={{
                  background: 'linear-gradient(180deg, #CC1111 0%, #990c0c 100%)',
                  border: '1px solid #FF4444',
                  color: '#FFFFFF',
                  fontFamily: 'Oswald, sans-serif',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <span>📑 BACK TO CASE LIST</span>
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              /* Desktop / Tablet User: Choice of Board or Case List */
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => handleActionClick('board')}
                  className="flex-1 py-3 px-4 rounded-xs transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-lg select-none"
                  style={{
                    background: 'linear-gradient(180deg, #CC1111 0%, #990c0c 100%)',
                    border: '1px solid #FF4444',
                    color: '#FFFFFF',
                    fontFamily: 'Oswald, sans-serif',
                    letterSpacing: '1.5px',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #E61919 0%, #B30D0D 100%)';
                    e.currentTarget.style.boxShadow = '0 0 18px rgba(204, 17, 17, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #CC1111 0%, #990c0c 100%)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                  }}
                >
                  <span>📌 EXPLORE BOARD AGAIN</span>
                  <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleActionClick('list')}
                  className="py-3 px-4 rounded-xs transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-md select-none text-[#D0C2B0] hover:text-white bg-[#1a1714] hover:bg-[#25201c] border border-[#4a3f35] hover:border-[#CC1111]/70"
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    letterSpacing: '1.5px',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  <span>📑 CASE LIST</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingModal;
