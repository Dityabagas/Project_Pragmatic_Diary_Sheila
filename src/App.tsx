import React, { useState, useCallback } from 'react';
import CrimeBoardCanvas from './components/CrimeBoardCanvas';
import CaseModal from './components/CaseModal';
import HUDOverlay from './components/HUDOverlay';
import { DiaryCase } from './types';

const App: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<DiaryCase | null>(null);

  const handleCaseSelect = useCallback((c: DiaryCase) => {
    setSelectedCase(c);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCase(null);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#1c1c1a' }}>
      {/* PixiJS WebGL layer — fills the entire screen */}
      <div className="absolute inset-0">
        <CrimeBoardCanvas onCaseSelect={handleCaseSelect} />
      </div>

      {/* React/Tailwind HUD overlay */}
      <HUDOverlay />

      {/* Modal */}
      <CaseModal selected={selectedCase} onClose={handleClose} />
    </div>
  );
};

export default App;
