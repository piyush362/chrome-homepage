import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Trash2, Plus, ChevronDown, ChevronUp, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';

export const QuickNotesWidget: React.FC = () => {
  const { notes, addNote, toggleNote, deleteNote, theme } = useStore();
  const [newNote, setNewNote] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  if (!theme.showNotesWidget) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(newNote);
    toast.success('Task added');
    setNewNote('');
  };

  const pendingCount = notes.filter((n) => !n.completed).length;

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Widget Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StickyNote size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
            Quick Scratchpad & Tasks
          </span>
          <span className="glass-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
            {pendingCount} remaining
          </span>
        </div>

        <button
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {/* Input Form */}
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add quick reminder or task..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="glass-input"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
              <button
                type="submit"
                className="glass-btn glass-btn-primary"
                style={{ padding: '8px 14px', flexShrink: 0 }}
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </form>

            {/* Notes List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '160px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {notes.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', padding: '8px 0' }}>
                  No tasks recorded. Keep track of quick thoughts here!
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        flex: 1,
                      }}
                      onClick={() => toggleNote(note.id)}
                    >
                      {note.completed ? (
                        <CheckSquare size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      ) : (
                        <Square size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                      )}
                      <span
                        style={{
                          fontSize: '13px',
                          color: note.completed ? 'var(--text-dim)' : 'var(--text-main)',
                          textDecoration: note.completed ? 'line-through' : 'none',
                        }}
                      >
                        {note.text}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteNote(note.id);
                        toast.info('Task deleted');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
