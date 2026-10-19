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
import { Plus, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { SortableBookmarkItem } from './SortableBookmarkItem';

export const BookmarksGrid: React.FC = () => {
  const {
    bookmarks,
    reorderBookmarks,
    activeCategory,
    setActiveCategory,
    setIsAddModalOpen,
  } = useStore();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Prevents drag conflict with clicking links
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(bookmarks.map((b) => b.category || 'General')))];

  const filteredBookmarks = activeCategory === 'All'
    ? bookmarks
    : bookmarks.filter((b) => (b.category || 'General') === activeCategory);

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
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Category Tabs Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              marginRight: '6px',
            }}
          >
            <LayoutGrid size={15} />
            <span>Shortcuts</span>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive
                    ? 'rgba(168, 85, 247, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isActive
                    ? '1px solid rgba(168, 85, 247, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: isActive ? '#ffffff' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Grid of Bookmarks with Dnd-Kit */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredBookmarks.map((b) => b.id)}
          strategy={rectSortingStrategy}
        >
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredBookmarks.map((bookmark) => (
              <SortableBookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}

            {/* Add New Shortcut Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.18)',
                borderRadius: '16px',
                padding: '16px',
                minHeight: '130px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.color = 'var(--text-dim)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={20} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>Add Shortcut</span>
            </motion.button>
          </motion.div>
        </SortableContext>

        {/* Drag Overlay for floating visual clone */}
        <DragOverlay>
          {activeBookmark ? (
            <SortableBookmarkItem bookmark={activeBookmark} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
};
