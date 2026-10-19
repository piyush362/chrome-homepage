import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ExternalLink } from 'lucide-react';
import { IconResolver } from './IconResolver';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import type { Bookmark } from '../types';

interface SortableBookmarkItemProps {
  bookmark: Bookmark;
  isOverlay?: boolean;
}

export const SortableBookmarkItem: React.FC<SortableBookmarkItemProps> = ({
  bookmark,
  isOverlay = false,
}) => {
  const { deleteBookmark, recordBookmarkClick } = useStore();
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
    opacity: isDragging ? 0.35 : 1,
    touchAction: 'none',
  };

  const handleClick = (e: React.MouseEvent) => {
    // If the click is on the action buttons or drag handle, don't open URL
    if ((e.target as HTMLElement).closest('.bookmark-action')) {
      return;
    }
    recordBookmarkClick(bookmark.id);
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBookmark(bookmark.id);
    toast.success(`Removed "${bookmark.title}" bookmark`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`glass-panel-interactive ${isDragging ? 'dnd-dragging' : ''} ${isOverlay ? 'dnd-drag-overlay' : ''}`}
    >
      <div
        style={{
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          userSelect: 'none',
          minHeight: '130px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top bar with drag handle and action */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="bookmark-action"
            style={{
              cursor: isOverlay ? 'grabbing' : 'grab',
              opacity: 0.45,
              padding: '2px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.2s',
            }}
            title="Drag to reorder"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
          >
            <GripVertical size={14} />
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="bookmark-action"
            title="Delete bookmark"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.45,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = '#f43f5e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.45';
              e.currentTarget.style.color = 'var(--text-dim)';
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Center icon in glowing circle */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: bookmark.color
              ? `radial-gradient(circle at top left, ${bookmark.color}33, rgba(255, 255, 255, 0.05))`
              : 'rgba(255, 255, 255, 0.08)',
            border: bookmark.color
              ? `1px solid ${bookmark.color}66`
              : '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: bookmark.color ? `0 8px 16px ${bookmark.color}25` : 'none',
            transition: 'transform 0.2s ease',
          }}
        >
          <IconResolver
            name={bookmark.icon}
            size={24}
            color={bookmark.color || 'var(--text-main)'}
          />
        </div>

        {/* Bottom Title & Category */}
        <div style={{ textAlign: 'center', width: '100%', overflow: 'hidden' }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span>{bookmark.title}</span>
            <ExternalLink size={11} style={{ opacity: 0.4 }} />
          </div>
          {bookmark.category && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {bookmark.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
