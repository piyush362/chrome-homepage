import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronDown, CornerDownLeft } from 'lucide-react';
import {
  SiGoogle,
  SiDuckduckgo,
  SiGithub,
  SiYoutube,
  SiPerplexity,
} from 'react-icons/si';
import { BsSearch } from 'react-icons/bs';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import type { SearchEngine } from '../types';

interface EngineConfig {
  id: SearchEngine;
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const SEARCH_ENGINES: EngineConfig[] = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: SiGoogle,
    color: '#4285F4',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: SiDuckduckgo,
    color: '#DE5833',
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: BsSearch,
    color: '#008373',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/search?q=',
    icon: SiGithub,
    color: '#a855f7',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=',
    icon: SiYoutube,
    color: '#EF4444',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/search?q=',
    icon: SiPerplexity,
    color: '#10B981',
  },
];

export const SearchBar: React.FC = () => {
  const { searchEngine, setSearchEngine } = useStore();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeEngine = SEARCH_ENGINES.find((e) => e.id === searchEngine) || SEARCH_ENGINES[0];
  const ActiveIcon = activeEngine.icon;

  // Global hotkey: press "/" or "Cmd/Ctrl+K" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement !== inputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close engine menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query is already a direct URL
    const trimmed = query.trim();
    if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(trimmed) && !trimmed.includes(' ')) {
      const targetUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
      window.location.href = targetUrl;
      return;
    }

    const searchUrl = `${activeEngine.url}${encodeURIComponent(trimmed)}`;
    window.location.href = searchUrl;
  };

  const handleSelectEngine = (eng: EngineConfig) => {
    setSearchEngine(eng.id);
    setIsMenuOpen(false);
    toast.success(`Search engine switched to ${eng.name}`);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      style={{
        width: '100%',
        maxWidth: '680px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <form onSubmit={handleSearch}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: isFocused
              ? 'rgba(25, 30, 45, 0.75)'
              : 'rgba(18, 22, 34, 0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: isFocused
              ? '1px solid rgba(168, 85, 247, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: isFocused
              ? '0 0 0 4px rgba(168, 85, 247, 0.25), 0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
              : '0 16px 36px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            borderRadius: '22px',
            padding: '6px 14px 6px 8px',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Engine Selector Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '8px 12px',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Select search engine"
          >
            <ActiveIcon size={18} />
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
          </button>

          {/* Search Input */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
            <Search size={18} style={{ color: 'var(--text-dim)', marginRight: '10px' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`Search with ${activeEngine.name} or enter URL...`}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '16px',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Action buttons on the right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
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
              >
                <X size={14} />
              </button>
            ) : (
              <kbd
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-dim)',
                  display: isFocused ? 'none' : 'block',
                }}
              >
                /
              </kbd>
            )}

            <button
              type="submit"
              disabled={!query.trim()}
              style={{
                background: query.trim() ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                padding: '8px 12px',
                color: query.trim() ? '#ffffff' : 'var(--text-dim)',
                cursor: query.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <span>Search</span>
              <CornerDownLeft size={13} />
            </button>
          </div>
        </div>
      </form>

      {/* Engine Selection Popover Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              background: 'rgba(18, 22, 34, 0.9)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
              gap: '6px',
              zIndex: 50,
            }}
          >
            {SEARCH_ENGINES.map((eng) => {
              const Icon = eng.icon;
              const isSelected = eng.id === searchEngine;
              return (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => handleSelectEngine(eng)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: isSelected
                      ? '1px solid rgba(168, 85, 247, 0.5)'
                      : '1px solid transparent',
                    background: isSelected
                      ? 'rgba(168, 85, 247, 0.18)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{eng.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
