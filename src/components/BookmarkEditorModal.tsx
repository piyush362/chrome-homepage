import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { validateAndNormalizeUrl } from '../utils/validateUrl';
import { BRAND_DIRECTORY } from '../utils/favicon';
import type { Bookmark } from '../types';

const COLOR_CHOICES = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
];

interface BookmarkEditorFormProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

const BookmarkEditorForm: React.FC<BookmarkEditorFormProps> = ({ bookmark, onClose }) => {
  const { addBookmark, updateBookmark, bookmarks, folders } = useBookmarkStore();

  const [title, setTitle] = useState(bookmark?.title || '');
  const [url, setUrl] = useState(bookmark?.url || '');
  const [faviconUrl, setFaviconUrl] = useState(bookmark?.faviconUrl || '');
  const [folderId, setFolderId] = useState(bookmark?.folderId || 'general');
  const [color, setColor] = useState(bookmark?.color || '#8b5cf6');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-detect brand color and title when user types URL
  const handleUrlBlur = () => {
    if (!url.trim()) return;
    const { isValid, normalizedUrl } = validateAndNormalizeUrl(url);
    if (isValid) {
      try {
        const domain = new URL(normalizedUrl).hostname.replace(/^www\./, '');
        if (BRAND_DIRECTORY[domain]) {
          if (!title.trim()) {
            setTitle(BRAND_DIRECTORY[domain].title);
          }
          setColor(BRAND_DIRECTORY[domain].color);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a website name.');
      return;
    }

    const { isValid, normalizedUrl, error } = validateAndNormalizeUrl(url);
    if (!isValid) {
      setErrorMessage(error || 'Invalid website URL.');
      return;
    }

    // Check for duplicate URLs (excluding currently edited item)
    const isDuplicate = bookmarks.some(
      (b) => b.id !== bookmark?.id && b.url.toLowerCase() === normalizedUrl.toLowerCase()
    );
    if (isDuplicate) {
      setErrorMessage('A shortcut for this URL already exists.');
      return;
    }

    if (bookmark) {
      updateBookmark(bookmark.id, {
        title: title.trim(),
        url: normalizedUrl,
        faviconUrl: faviconUrl.trim() || undefined,
        folderId,
        color,
      });
      toast.success(`Updated "${title.trim()}"`);
    } else {
      addBookmark({
        title: title.trim(),
        url: normalizedUrl,
        faviconUrl: faviconUrl.trim() || undefined,
        folderId,
        color,
      });
      toast.success(`Added shortcut "${title.trim()}"`);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {errorMessage && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '13px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Name
        </label>
        <input
          type="text"
          placeholder="e.g. YouTube, GitHub"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="glass-input-field"
          required
        />
      </div>

      {/* URL */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          URL
        </label>
        <input
          type="text"
          placeholder="youtube.com or https://youtube.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleUrlBlur}
          className="glass-input-field"
          required
        />
      </div>

      {/* Folder / Category Selection */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Folder
        </label>
        <select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="glass-input-field"
          style={{
            background: 'var(--glass-surface)',
            color: 'var(--text-main)',
            cursor: 'pointer',
          }}
        >
          {folders.map((f) => (
            <option key={f.id} value={f.id} style={{ background: '#1e2433', color: '#ffffff' }}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Custom Favicon URL */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Custom Favicon URL (Optional)
        </label>
        <input
          type="text"
          placeholder="Leave blank for automatic icon"
          value={faviconUrl}
          onChange={(e) => setFaviconUrl(e.target.value)}
          className="glass-input-field"
        />
      </div>

      {/* Accent Color Picker */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Accent Color
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {COLOR_CHOICES.map((c) => {
            const isSelected = color === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: c,
                  border: isSelected ? '2px solid #ffffff' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? `0 0 10px ${c}` : 'none',
                }}
              >
                {isSelected && <Check size={13} color="#ffffff" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <button
          type="button"
          className="glass-button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="glass-button glass-button-primary">
          {bookmark ? 'Save Changes' : 'Add Shortcut'}
        </button>
      </div>
    </form>
  );
};

export const BookmarkEditorModal: React.FC = () => {
  const { isEditorOpen, editingBookmark, closeEditor } = useBookmarkStore();

  if (!isEditorOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditor}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="glass-surface"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            position: 'relative',
            zIndex: 10000,
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(16, 22, 36, 0.95)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sparkles size={18} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                {editingBookmark ? 'Edit Shortcut' : 'Add Shortcut'}
              </h3>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <BookmarkEditorForm
            key={editingBookmark ? editingBookmark.id : 'new'}
            bookmark={editingBookmark}
            onClose={closeEditor}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
