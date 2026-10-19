import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Camera, Sparkles } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' &&
          document.activeElement !== inputRef.current &&
          !(
            document.activeElement instanceof HTMLInputElement ||
            document.activeElement instanceof HTMLTextAreaElement
          )) ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Direct URL navigation if valid web address
    if (
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(trimmed) &&
      !trimmed.includes(' ')
    ) {
      const destination =
        trimmed.startsWith('http://') || trimmed.startsWith('https://')
          ? trimmed
          : `https://${trimmed}`;
      window.location.href = destination;
      return;
    }

    // Google search in current tab
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  };

  const handleVoiceSearch = () => {
    interface SpeechEvent {
      results: Array<Array<{ transcript: string }>>;
    }
    interface SpeechInstance {
      lang: string;
      start: () => void;
      onresult: ((event: SpeechEvent) => void) | null;
      onerror: (() => void) | null;
    }
    type SpeechCtor = new () => SpeechInstance;

    const win = window as unknown as {
      SpeechRecognition?: SpeechCtor;
      webkitSpeechRecognition?: SpeechCtor;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: SpeechEvent) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setQuery(transcript);
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(transcript)}`;
          }
        };
        recognition.onerror = () => {
          window.location.href = 'https://www.google.com';
        };
      } catch {
        window.location.href = 'https://www.google.com';
      }
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  const handleLensSearch = () => {
    window.location.href = 'https://lens.google.com/upload';
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Authentic Google Wordmark (matching Chrome mobile default) */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          userSelect: 'none',
        }}
      >
        <svg
          viewBox="0 0 272 92"
          width="156"
          height="52"
          style={{
            display: 'block',
            filter: 'drop-shadow(0 2px 14px rgba(0, 0, 0, 0.45))',
          }}
          aria-label="Google"
        >
          <path
            fill="#ffffff"
            d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#ffffff"
            d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#ffffff"
            d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 8.16 11.18 8.16 7.31 0 11.84-4.53 11.84-13.07v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.86h9.94zm-8.98 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
          />
          <path fill="#ffffff" d="M225 3v65h-9.5V3h9.5z" />
          <path
            fill="#ffffff"
            d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-13.27-8.24l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
          />
          <path
            fill="#ffffff"
            d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
          />
        </svg>
      </motion.div>

      {/* Main Google Search Pill */}
      <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: isFocused ? -2 : 0,
            scale: isFocused ? 1.015 : 1,
          }}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.995 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          className="glass-surface"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minHeight: '54px',
            padding: '8px 14px 8px 14px',
            borderRadius: '9999px',
            borderColor: isFocused ? 'rgba(66, 133, 244, 0.75)' : 'var(--surface-border)',
            boxShadow: isFocused
              ? '0 0 0 3px rgba(66, 133, 244, 0.28), 0 16px 36px -6px rgba(0, 0, 0, 0.45), var(--glass-specular)'
              : 'var(--glass-shadow), var(--glass-specular)',
            background: isFocused
              ? 'rgba(18, 24, 38, 0.88)'
              : 'var(--glass-surface)',
            cursor: 'text',
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Authentic Google 4-Color Logo */}
          <motion.div
            animate={{ scale: isFocused ? 1.08 : 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 6px 4px 2px',
              flexShrink: 0,
              userSelect: 'none',
            }}
            title="Google Search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ display: 'block' }}>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </motion.div>

          {/* Search Input */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '4px',
              minWidth: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search Google or type URL"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '16px',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.2px',
              }}
            />
          </div>

          {/* Right Action Icons: Clear (when query present) or Mic + Lens (when empty) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <AnimatePresence>
              {query ? (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.22)' }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.14)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                  }}
                  aria-label="Clear query"
                >
                  <X size={14} />
                </motion.button>
              ) : (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {/* Microphone / Voice search */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoiceSearch();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                    title="Search by voice"
                    aria-label="Search by voice"
                  >
                    <Mic size={20} />
                  </motion.button>

                  {/* Google Lens / Camera */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLensSearch();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                    title="Search with Google Lens"
                    aria-label="Search with Google Lens"
                  >
                    <Camera size={20} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>

      {/* Action Pills: AI Mode & Incognito (matching native Chrome mobile default) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          marginTop: '12px',
        }}
      >
        {/* AI Mode Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => (window.location.href = 'https://gemini.google.com')}
          style={{
            flex: 1,
            maxWidth: '200px',
            height: '42px',
            borderRadius: '9999px',
            border: 'none',
            background: '#ffffff',
            color: '#1e293b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
            cursor: 'pointer',
            letterSpacing: '-0.2px',
          }}
          title="Open Google Gemini AI"
        >
          <Sparkles size={16} style={{ color: '#1e293b' }} />
          <span>AI Mode</span>
        </motion.button>

        {/* Incognito Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => (window.location.href = 'https://duckduckgo.com')}
          style={{
            flex: 1,
            maxWidth: '200px',
            height: '42px',
            borderRadius: '9999px',
            border: 'none',
            background: '#ffffff',
            color: '#1e293b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
            cursor: 'pointer',
            letterSpacing: '-0.2px',
          }}
          title="Open Private Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1e293b">
            <path d="M12 2C8.5 2 6 3.5 4 5L2 6V8H22V6L20 5C18 3.5 15.5 2 12 2ZM6.5 13C5.12 13 4 14.12 4 15.5C4 16.88 5.12 18 6.5 18C7.88 18 9 16.88 9 15.5C9 14.12 7.88 13 6.5 13ZM17.5 13C16.12 13 15 14.12 15 15.5C15 16.88 16.12 18 17.5 18C18.88 18 20 16.88 20 15.5C20 14.12 18.88 13 17.5 13ZM10.5 14H13.5V17H10.5V14Z" />
          </svg>
          <span>Incognito</span>
        </motion.button>
      </div>
    </div>
  );
};
