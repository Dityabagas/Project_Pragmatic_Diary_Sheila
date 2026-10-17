import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onStart: () => void;
}

const OpeningModal: React.FC<Props> = ({ isOpen, onStart }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
    }
  }, [isOpen]);

  const handleStartClick = () => {
    setIsAnimatingOut(true);
    // Smooth transition delay before calling onStart
    setTimeout(() => {
      onStart();
      setShouldRender(false);
    }, 450);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-out ${
        isAnimatingOut
          ? 'opacity-0 backdrop-blur-none pointer-events-none'
          : 'opacity-100 backdrop-blur-md bg-black/65'
      }`}
      style={{
        backdropFilter: isAnimatingOut ? 'blur(0px)' : 'blur(10px)',
        WebkitBackdropFilter: isAnimatingOut ? 'blur(0px)' : 'blur(10px)',
      }}
    >
      {/* Background vignette vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

      {/* Main Memo Card */}
      <div
        className={`relative w-full max-w-[460px] p-6 sm:p-8 rounded-sm shadow-2xl transition-all duration-450 ease-out border transform ${
          isAnimatingOut
            ? 'scale-95 translate-y-3 opacity-0'
            : 'anim-memo-card'
        }`}
        style={{
          background: 'linear-gradient(145deg, #161412 0%, #0d0c0a 100%)',
          borderColor: 'rgba(204, 17, 17, 0.45)',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.85), 0 0 25px rgba(204,17,17,0.15)',
        }}
      >
        {/* Top Red Pushpin decoration */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center anim-pin-drop">
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

        {/* Top header badge */}
        <div className="flex items-center justify-between border-b border-[#3a3028] pb-3 mb-4 mt-1 anim-badge-fade">
          <span
            className="text-[10px] sm:text-[11px] tracking-[2px] font-bold text-[#CC1111] uppercase"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            📌 Case Dossier // Coursework Note
          </span>
          <span
            className="text-[9px] tracking-widest text-[#8A7A6A] font-mono"
            style={{ fontFamily: '"Courier Prime", monospace' }}
          >
            REF: 2026-ENG
          </span>
        </div>

        {/* Welcome Headline & Declassified Stamp */}
        <div className="flex items-start justify-between relative mb-4">
          <h1
            className="text-2xl sm:text-3xl text-[#F5E8CC] tracking-wide anim-headline-fade"
            style={{ fontFamily: '"Special Elite", serif' }}
          >
            Welcome!
          </h1>

          {/* DECLASSIFIED / ACCESS GRANTED Red Ink Stamp */}
          <div className="pointer-events-none select-none anim-declassified-stamp">
            <div
              className="px-2 py-0.5 border-2 border-dashed border-[#CC1111] text-[#CC1111] rounded-xs font-bold tracking-[2px] text-[10px] sm:text-[11px] uppercase bg-[#CC1111]/15 backdrop-blur-xs"
              style={{
                fontFamily: 'Oswald, sans-serif',
                boxShadow: '0 0 12px rgba(204,17,17,0.3)',
                textShadow: '0 0 4px rgba(204,17,17,0.5)',
              }}
            >
              DECLASSIFIED
            </div>
          </div>
        </div>

        {/* Body Text (Short Paragraphs with Redaction Reveal) */}
        <div
          className="space-y-3.5 text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#D0C2B0]"
          style={{ fontFamily: '"Courier Prime", monospace' }}
        >
          <p className="anim-para-1">
            This project serves as my coursework reflection for{' '}
            <span className="relative inline-block px-1 mx-0.5 font-semibold text-[#FF5252] bg-black/40 rounded-xs">
              Pragmatics
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-redact-bar-1 rounded-xs pointer-events-none"
                style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
              />
            </span>
            , exploring how language, meaning, and context connect in everyday life.
          </p>

          <p className="anim-para-2">
            Special thanks to{' '}
            <strong className="relative inline-block px-1 mx-0.5 font-bold text-[#F5E8CC] bg-black/40 rounded-xs">
              Bu Dian
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-redact-bar-2 rounded-xs pointer-events-none"
                style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
              />
            </strong>{' '}
            for guiding and helping me put this diary together. Enjoy exploring the board!
          </p>
        </div>

        {/* Sign-off / Signature */}
        <div className="mt-5 pt-3 border-t border-[#3a3028]/80 text-[13px] text-[#A69582] anim-sign-off">
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
                className="absolute inset-0 bg-[#080706] border-y border-[#3a3028] anim-redact-bar-3 rounded-xs pointer-events-none"
                style={{ boxShadow: '0 0 6px rgba(0,0,0,0.9)' }}
              />
            </span>
          </div>
        </div>

        {/* Call-to-action Start Button */}
        <div className="mt-6 anim-button-fade">
          <button
            onClick={handleStartClick}
            className="w-full py-3 px-5 rounded-xs transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-lg select-none"
            style={{
              background: 'linear-gradient(180deg, #CC1111 0%, #990c0c 100%)',
              border: '1px solid #FF4444',
              color: '#FFFFFF',
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '2px',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #E61919 0%, #B30D0D 100%)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(204, 17, 17, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #CC1111 0%, #990c0c 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            }}
          >
            <span>OPEN CASE BOARD</span>
            <span className="transform transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Quick helper tip underneath */}
        <div className="mt-3 text-center anim-tip-fade">
          <span
            className="text-[10px] text-[#7A6A5A] tracking-wider uppercase"
            style={{ fontFamily: '"Courier Prime", monospace' }}
          >
            Click any card on the board to view full analysis
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpeningModal;
