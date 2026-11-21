import React, { useState, useCallback, useEffect } from 'react';
import CrimeBoardCanvas from './components/CrimeBoardCanvas';
import CaseListView from './components/CaseListView';
import CaseModal from './components/CaseModal';
import HUDOverlay from './components/HUDOverlay';
import OpeningModal from './components/OpeningModal';
import ClosingModal from './components/ClosingModal';
import { DiaryCase } from './types';
import { diaryCases } from './data/diaryCases.data';

const READ_CASES_STORAGE_KEY = 'pragmatics_read_cases';

const getInitialReadCases = (): string[] => {
  try {
    const raw = localStorage.getItem(READ_CASES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
};

const App: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<DiaryCase | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isOpeningOpen, setIsOpeningOpen] = useState(true);
  const [isClosingOpen, setIsClosingOpen] = useState(false);
  const [readCaseIds, setReadCaseIds] = useState<string[]>(getInitialReadCases);

  const isAllCasesRead = diaryCases.every((c) => readCaseIds.includes(c.id));

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
    setReadCaseIds((prev) => {
      if (prev.includes(c.id)) return prev;
      const updated = [...prev, c.id];
      try {
        localStorage.setItem(READ_CASES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCase(null);
  }, []);

  const handleStartExploring = useCallback(() => {
    setIsOpeningOpen(false);
  }, []);

  const handleReopenNote = useCallback(() => {
    setIsOpeningOpen(true);
  }, []);

  const handleOpenClosing = useCallback(() => {
    setSelectedCase(null);
    setIsClosingOpen(true);
  }, []);

  const handleCloseClosing = useCallback((targetMode?: 'board' | 'list') => {
    setIsClosingOpen(false);
    if (targetMode) {
      setViewMode(targetMode);
    }
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
          <CaseListView
            onCaseSelect={handleCaseSelect}
            onOpenClosing={handleOpenClosing}
            readCaseIds={readCaseIds}
            isAllCasesRead={isAllCasesRead}
          />
        </div>
      )}

      {/* React/Tailwind HUD overlay with View Switcher & Note button */}
      <HUDOverlay
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenNote={handleReopenNote}
        onOpenClosing={handleOpenClosing}
        isAllCasesRead={isAllCasesRead}
      />

      {/* Modal for viewing individual case */}
      <CaseModal
        selected={selectedCase}
        onClose={handleClose}
        onSelectCase={handleCaseSelect}
        onOpenClosing={handleOpenClosing}
        isAllCasesRead={isAllCasesRead}
        readCaseIds={readCaseIds}
      />

      {/* Opening Welcome Memo Overlay */}
      <OpeningModal
        isOpen={isOpeningOpen}
        onStart={handleStartExploring}
      />

      {/* Closing Epilogue Dossier Overlay */}
      <ClosingModal
        isOpen={isClosingOpen}
        onClose={handleCloseClosing}
      />
    </div>
  );
};

export default App;
