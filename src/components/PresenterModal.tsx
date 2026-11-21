import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAll: () => void;
  onResetAll: () => void;
  readCount: number;
  totalCount: number;
}

const PresenterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUnlockAll,
  onResetAll,
  readCount,
  totalCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md p-6 rounded-sm shadow-2xl border border-red-500/60"
        style={{
          background: 'linear-gradient(150deg, #1b1713 0%, #0d0c0a 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(204,17,17,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#3a3028] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#CC1111]">⚡</span>
            <span
              className="text-xs sm:text-sm font-bold tracking-[2px] text-[#CC1111] uppercase"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              PRESENTER OVERRIDE // SECRET MENU
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A7A6A] hover:text-white transition-colors cursor-pointer text-lg leading-none p-1"
            aria-label="Close presenter menu"
          >
            ✕
          </button>
        </div>

        {/* Description & Current Status */}
        <p
          className="text-xs text-[#C5B5A5] leading-relaxed mb-4"
          style={{ fontFamily: '"Courier Prime", monospace' }}
        >
          Special control panel for demonstrations and presentations on both mobile & desktop.
        </p>

        <div
          className="p-3 rounded-xs mb-5 border border-[#3a3028]"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="text-[11px] font-bold tracking-wider text-[#8A7A6A] uppercase mb-1"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            CURRENT STATUS
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-sm sm:text-base font-bold text-[#F5E8CC]"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {readCount} of {totalCount} Cases Examined
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border uppercase tracking-wider ${
                readCount >= totalCount
                  ? 'bg-green-950/60 text-green-400 border-green-600'
                  : 'bg-amber-950/60 text-amber-400 border-amber-600'
              }`}
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {readCount >= totalCount ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              onUnlockAll();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xs transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer shadow-lg select-none"
            style={{
              background: 'linear-gradient(180deg, #1b7a3e 0%, #12572b 100%)',
              border: '1px solid #34d399',
              color: '#FFFFFF',
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '1.5px',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            <span>🔓 UNLOCK ALL (7/7) — INSTANT DEMO</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResetAll();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xs transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer shadow-md select-none text-[#F5E8CC] hover:text-white bg-[#221c17] hover:bg-[#2c241e] border border-[#5a483a] hover:border-red-500/70"
            style={{
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '1.5px',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            <span>↺ RESET PROGRESS (0/7) — START FROM ZERO</span>
          </button>
        </div>

        {/* Hint footer */}
        <div className="mt-4 pt-3 border-t border-[#3a3028]/60 text-center">
          <span
            className="text-[10px] text-[#7A6A5A] italic"
            style={{ fontFamily: '"Courier Prime", monospace' }}
          >
            💡 Tap the top Case File badge 3x anytime to open this menu.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PresenterModal;
