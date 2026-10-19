import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const Header: React.FC = () => {
  const { settings, toggleThemeMode, setIsSettingsOpen } = useSettingsStore();

  const today = new Date();
  const dayName = today.toLocaleDateString(undefined, { weekday: 'short' });
  const monthDay = today.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '36px',
        padding: '0 4px',
        marginBottom: '6px',
      }}
    >
      {/* Subtle clean date indicator on the left */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-dim)',
          userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{dayName},</span>
        <span>{monthDay}</span>
      </div>

      {/* Segmented Glass Capsule: Theme Toggle + Settings (Right) */}
      <div
        className="glass-surface"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '38px',
          padding: '3px',
          borderRadius: '9999px',
          gap: '2px',
        }}
      >
        {/* Theme Mode Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={toggleThemeMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          title={`Switch to ${settings.themeMode === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme mode"
        >
          {settings.themeMode === 'dark' ? (
            <Sun
              size={16}
              style={{
                color: '#f59e0b',
                filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))',
              }}
            />
          ) : (
            <Moon
              size={16}
              style={{
                color: '#6366f1',
                filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))',
              }}
            />
          )}
        </motion.button>

        {/* Delicate Glass Divider */}
        <div
          style={{
            width: '1px',
            height: '16px',
            background: 'var(--surface-border)',
            opacity: 0.6,
          }}
        />

        {/* Settings Drawer Button */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 30 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-main)',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          title="Open Settings"
          aria-label="Open settings"
        >
          <SettingsIcon size={16} />
        </motion.button>
      </div>
    </motion.header>
  );
};
