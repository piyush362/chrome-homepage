import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'motion/react';
import { Plus, RotateCcw, BookmarkX } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { BookmarkCard } from './BookmarkCard';
import { FolderNavigation } from './FolderNavigation';

export const BookmarkGrid: React.FC = () => {
  const {
    bookmarks,
    activeFolderId,
    reorderBookmarks,
    openAddModal,
    restoreDemoBookmarks,
  } = useBookmarkStore();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Setup sensors with activation constraint for smooth touch & click separation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const displayedBookmarks = activeFolderId === 'all'
    ? bookmarks
    : bookmarks.filter((b) => b.folderId === activeFolderId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBookmarks(active.id as string, over.id as string);
      toast.success('Bookmark order saved');
    }
    setActiveDragId(null);
  };

  const activeBookmark = activeDragId
    ? bookmarks.find((b) => b.id === activeDragId)
    : null;

  return (
    <section
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Folder Category Navigator */}
      <FolderNavigation />

      {/* Bookmarks Grid / Empty State */}
      {displayedBookmarks.length === 0 ? (
        <div
          className="glass-surface"
          style={{
            padding: '36px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dim)',
            }}
          >
            <BookmarkX size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
              No shortcuts in this collection
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Add a custom website shortcut or restore default demo bookmarks.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={openAddModal}
              className="glass-button glass-button-primary"
            >
              <Plus size={15} />
              <span>Add Shortcut</span>
            </button>
            <button
              type="button"
              onClick={() => {
                restoreDemoBookmarks();
                toast.success('Default bookmarks restored');
              }}
              className="glass-button"
            >
              <RotateCcw size={14} />
              <span>Restore Defaults</span>
            </button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayedBookmarks.map((b) => b.id)}
            strategy={rectSortingStrategy}
          >
            <div className="bookmark-grid">
              {displayedBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}

              {/* Add Bookmark Card Button */}
              <div
                onClick={openAddModal}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 2px',
                  borderRadius: 'var(--card-radius)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <motion.div
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  className="glass-surface"
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed var(--surface-border)',
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    boxShadow: 'var(--glass-shadow)',
                  }}
                  title="Add new bookmark"
                >
                  <Plus size={22} />
                </motion.div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                  }}
                >
                  Add
                </span>
              </div>
            </div>
          </SortableContext>

          {/* DND Drag Overlay */}
          <DragOverlay>
            {activeBookmark ? <BookmarkCard bookmark={activeBookmark} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </section>
  );
};
