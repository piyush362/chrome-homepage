import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useSettingsStore } from './store/useSettingsStore';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BookmarkGrid } from './components/BookmarkGrid';
import { BookmarkEditorModal } from './components/BookmarkEditorModal';
import { FolderManagerModal } from './components/FolderManagerModal';
import { SettingsPanel } from './components/SettingsPanel';

export function App() {
  const { applyCssVariables } = useSettingsStore();

  useEffect(() => {
    applyCssVariables();
  }, [applyCssVariables]);

  return (
    <>
      {/* Toast Notification Provider */}
      <Toaster
        position="bottom-center"
        richColors
        toastOptions={{
          style: {
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--surface-border)',
            boxShadow: 'var(--glass-shadow)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-sans)',
            borderRadius: '14px',
            fontSize: '13px',
          },
        }}
      />

      {/* Ambient Moving Liquid Glass Lighting */}
      <div className="ambient-background-layer" aria-hidden="true" />

      {/* Main Mobile-First Chrome Homepage Container */}
      <main className="homepage-container">
        <Header />
        <SearchBar />
        <BookmarkGrid />
      </main>

      {/* Interactive Modals and Drawers */}
      <BookmarkEditorModal />
      <FolderManagerModal />
      <SettingsPanel />
    </>
  );
}

export default App;
