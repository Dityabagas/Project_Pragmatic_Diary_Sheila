import React, { useState, useCallback, useEffect } from 'react';
import CrimeBoardCanvas from './components/CrimeBoardCanvas';
import CaseListView from './components/CaseListView';
import CaseModal from './components/CaseModal';
import HUDOverlay from './components/HUDOverlay';
import { DiaryCase } from './types';

const App: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<DiaryCase | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Screen mode rules:
  // Mobile (<768px): Force Case List view
  // Tablet/iPad & Desktop (>=768px): Allow free toggle between Board & Case List
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCaseSelect = useCallback((c: DiaryCase) => {
    setSelectedCase(c);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCase(null);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#1c1c1a' }}>
      {/* Dynamic Main View: Board (PixiJS Canvas) vs List (Scrollable Cards Feed) */}
      {viewMode === 'board' ? (
        <div className="absolute inset-0">
          <CrimeBoardCanvas onCaseSelect={handleCaseSelect} />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-y-auto">
          <CaseListView onCaseSelect={handleCaseSelect} />
        </div>
      )}

      {/* React/Tailwind HUD overlay with View Switcher */}
      <HUDOverlay viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Modal */}
      <CaseModal selected={selectedCase} onClose={handleClose} />
    </div>
  );
};

export default App;
