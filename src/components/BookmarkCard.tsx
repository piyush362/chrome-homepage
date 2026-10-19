import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Copy, Trash2, ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { IconResolver } from './IconResolver';
import type { Bookmark } from '../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  isOverlay?: boolean;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, isOverlay = false }) => {
  const {
    openEditModal,
    deleteBookmark,
    duplicateBookmark,
    moveBookmarkAccessible,
  } = useBookmarkStore();

  const [imgError, setImgError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id, disabled: isOverlay });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'manipulation',
    position: 'relative',
    zIndex: isMenuOpen ? 300 : isDragging ? 100 : 1,
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isLongPressTriggeredRef.current = false;
    startCoordsRef.current = { x: e.clientX, y: e.clientY };

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(40);
      }
      setIsMenuOpen(true);
    }, 480);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startCoordsRef.current) return;
    const dx = Math.abs(e.clientX - startCoordsRef.current.x);
    const dy = Math.abs(e.clientY - startCoordsRef.current.y);
    if (dx > 8 || dy > 8) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    startCoordsRef.current = null;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.bookmark-menu-area')) {
      return;
    }
    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      return;
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    window.location.href = bookmark.url;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    openEditModal(bookmark);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    duplicateBookmark(bookmark.id);
    toast.success(`Duplicated "${bookmark.title}"`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    deleteBookmark(bookmark.id);
    toast.success(`Removed "${bookmark.title}"`);
  };

  const handleMove = (e: React.MouseEvent, dir: 'left' | 'right') => {
    e.stopPropagation();
    moveBookmarkAccessible(bookmark.id, dir);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bookmark-item-wrap ${isDragging ? 'dnd-item-active' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
      onClick={handleCardClick}
    >
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 6px',
          borderRadius: 'var(--card-radius)',
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        {/* Squircle Glass Icon Container (Mobile Chrome aesthetic) */}
        <div
          className="glass-surface"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: bookmark.color
              ? `radial-gradient(circle at top left, ${bookmark.color}25, var(--glass-surface))`
              : 'var(--glass-surface)',
            border: bookmark.color
              ? `1px solid ${bookmark.color}45`
              : '1px solid var(--surface-border)',
            boxShadow: bookmark.color
              ? `0 8px 18px -4px ${bookmark.color}30, var(--glass-specular)`
              : 'var(--glass-shadow)',
          }}
        >
          {/* Favicon or graceful fallback to Brand/Lucide icon */}
          {bookmark.faviconUrl && !imgError ? (
            <img
              src={bookmark.faviconUrl}
              alt=""
              onError={() => setImgError(true)}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                objectFit: 'contain',
              }}
              loading="lazy"
            />
          ) : bookmark.iconName ? (
            <IconResolver
              name={bookmark.iconName}
              size={24}
              color={bookmark.color || 'var(--text-main)'}
            />
          ) : (
            <Globe size={24} style={{ color: bookmark.color || 'var(--text-main)' }} />
          )}
        </div>

        {/* Website Title */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-main)',
            textAlign: 'center',
            maxWidth: '82px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '-0.1px',
          }}
        >
          {bookmark.title}
        </span>

        {/* Contextual Menu Dropdown (Triggered by Long-Press or Right-Click) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.15 }}
              className="glass-surface bookmark-menu-area"
              style={{
                position: 'absolute',
                top: '64px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                minWidth: '145px',
                zIndex: 500,
                background: 'rgba(16, 22, 36, 0.96)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 20px 48px -10px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Copy size={13} />
                <span>Duplicate</span>
              </button>

              {/* Accessible Reorder Alternatives */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderTop: '1px solid var(--surface-border-subtle)',
                  borderBottom: '1px solid var(--surface-border-subtle)',
                  margin: '2px 0',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Move</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={(e) => handleMove(e, 'left')}
                    title="Move Left"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 6px',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleMove(e, 'right')}
                    title="Move Right"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 6px',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
