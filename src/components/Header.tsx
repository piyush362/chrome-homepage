import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Sun, Moon, Calendar } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const Header: React.FC = () => {
  const { settings, toggleThemeMode, setIsSettingsOpen } = useSettingsStore();

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '44px',
        padding: '4px 0',
      }}
    >
      {/* Date badge on the left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          className="glass-chip"
          style={{
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Calendar size={13} style={{ color: 'var(--accent-primary)' }} />
          <span>{formattedDate}</span>
        </span>
      </div>

      {/* Theme toggle & Settings buttons on the right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="glass-button"
          onClick={toggleThemeMode}
          style={{ padding: '8px 10px', borderRadius: '12px' }}
          title={`Switch to ${settings.themeMode === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme mode"
        >
          {settings.themeMode === 'dark' ? (
            <Sun size={17} style={{ color: '#f59e0b' }} />
          ) : (
            <Moon size={17} style={{ color: '#6366f1' }} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 20 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="glass-button"
          onClick={() => setIsSettingsOpen(true)}
          style={{ padding: '8px 10px', borderRadius: '12px' }}
          title="Open Settings"
          aria-label="Open settings"
        >
          <SettingsIcon size={17} />
        </motion.button>
      </div>
    </motion.header>
  );
};
