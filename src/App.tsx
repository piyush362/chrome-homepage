import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BookmarksGrid } from './components/BookmarksGrid';
import { QuickNotesWidget } from './components/QuickNotesWidget';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { SettingsDrawer } from './components/SettingsDrawer';

export function App() {
  const { theme } = useStore();

  // Sync background theme with document.body attribute
  useEffect(() => {
    document.body.setAttribute('data-theme', theme.backgroundTheme);
  }, [theme.backgroundTheme]);

  return (
    <>
      {/* Toast Notification Hub */}
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(18, 22, 34, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            fontFamily: 'var(--font-sans)',
            borderRadius: '14px',
          },
        }}
      />

      {/* Ambient Moving Mesh Lights */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb orb-one" />
        <div className="ambient-orb orb-two" />
        <div className="ambient-orb orb-three" />
        <div className="ambient-noise" />
      </div>

      {/* Main Page Content */}
      <div className="app-container">
        <Header />
        <SearchBar />
        <BookmarksGrid />
        <QuickNotesWidget />

        {/* Subtle Footer */}
        <footer
          style={{
            marginTop: 'auto',
            paddingTop: '20px',
            fontSize: '12px',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span>
            Tip: Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)' }}>/</kbd> to search
          </span>
          <span>•</span>
          <span>Drag shortcuts to sort</span>
          <span>•</span>
          <span>Powered by React, Motion, Zustand & dnd-kit</span>
        </footer>
      </div>

      {/* Interactive Modals and Drawers */}
      <AddBookmarkModal />
      <SettingsDrawer />
    </>
  );
}

export default App;
