import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

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

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <form onSubmit={handleSearchSubmit}>
        <div
          className="glass-surface"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px 8px 12px',
            borderRadius: '9999px',
            borderColor: isFocused ? 'var(--accent-primary)' : 'var(--surface-border)',
            boxShadow: isFocused
              ? '0 0 0 3px var(--accent-glow), var(--glass-shadow)'
              : 'var(--glass-shadow)',
          }}
        >
          {/* Authentic Google 4-Color Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 8px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
            title="Google Search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block' }}>
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
          </div>

          {/* Search Input */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '6px',
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
              placeholder="Search Google or type a URL..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Clear Button when text is entered */}
          {query && (
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                aria-label="Clear query"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
