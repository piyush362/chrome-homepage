import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Plus, Sparkles, CloudSun } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { theme, setIsSettingsOpen, setIsAddModalOpen } = useStore();
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time based on theme preferences
  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (!theme.clockFormat24) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }

    const hoursStr = hours.toString().padStart(theme.clockFormat24 ? 2 : 1, '0');
    return {
      main: `${hoursStr}:${minutes}`,
      seconds: theme.showSeconds ? `:${seconds}` : '',
      ampm,
    };
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const { main, seconds, ampm } = formatTime();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        gap: '12px',
      }}
    >
      {/* Top action bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
            <span>Liquid Glass</span>
          </span>
          {theme.showWeather && (
            <span className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CloudSun size={13} style={{ color: '#38bdf8' }} />
              <span>24°C Sunny</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-btn"
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add Bookmark"
          >
            <Plus size={16} />
            <span>Add Shortcut</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 30 }}
            whileTap={{ scale: 0.95 }}
            className="glass-btn"
            onClick={() => setIsSettingsOpen(true)}
            style={{ padding: '8px 10px', borderRadius: '12px' }}
            aria-label="Settings"
          >
            <Settings size={18} />
          </motion.button>
        </div>
      </div>

      {/* Hero Clock & Greeting Display */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '16px',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        <motion.div
          key={main}
          initial={{ opacity: 0.8, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: 'clamp(54px, 8vw, 86px)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-2px',
            background: 'linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <span>{main}</span>
          {seconds && (
            <span
              style={{
                fontSize: '0.4em',
                fontWeight: 500,
                opacity: 0.75,
                marginLeft: '4px',
                color: 'var(--text-muted)',
                WebkitTextFillColor: 'initial',
              }}
            >
              {seconds}
            </span>
          )}
          {ampm && (
            <span
              style={{
                fontSize: '0.3em',
                fontWeight: 600,
                marginLeft: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--accent-primary)',
                WebkitTextFillColor: 'initial',
              }}
            >
              {ampm}
            </span>
          )}
        </motion.div>

        {theme.showGreeting && (
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              marginTop: '10px',
              letterSpacing: '0.2px',
            }}
          >
            {getGreeting()}, explorer • <span style={{ color: 'var(--text-main)' }}>{formattedDate}</span>
          </p>
        )}
      </div>
    </motion.header>
  );
};
