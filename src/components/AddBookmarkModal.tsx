import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { AVAILABLE_ICONS, IconResolver } from './IconResolver';

const COLOR_PRESETS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
];

export const AddBookmarkModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addBookmark } = useStore();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Tools');
  const [selectedIcon, setSelectedIcon] = useState('Globe');
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('Please enter both title and URL');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    addBookmark({
      title: title.trim(),
      url: finalUrl,
      category: category.trim() || 'General',
      icon: selectedIcon,
      color: selectedColor,
    });

    toast.success(`Shortcut "${title.trim()}" added!`);
    setIsAddModalOpen(false);

    // Reset form
    setTitle('');
    setUrl('');
    setCategory('Tools');
    setSelectedIcon('Globe');
    setSelectedColor('#8b5cf6');
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
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
          onClick={() => setIsAddModalOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            position: 'relative',
            zIndex: 101,
            maxHeight: '90vh',
            overflowY: 'auto',
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
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
                Add New Shortcut
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Shortcut Title
              </label>
              <input
                type="text"
                placeholder="e.g. GitHub, Netflix, Documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Target URL
              </label>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="glass-input"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Category
              </label>
              <input
                type="text"
                placeholder="Development, Media, Social, Tools"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Choose Icon
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '8px',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  padding: '4px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                {AVAILABLE_ICONS.map((iconItem) => {
                  const isSelected = selectedIcon === iconItem.id;
                  return (
                    <button
                      key={iconItem.id}
                      type="button"
                      onClick={() => setSelectedIcon(iconItem.id)}
                      title={iconItem.label}
                      style={{
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        background: isSelected
                          ? 'var(--accent-glow)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '1px solid var(--accent-primary)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <IconResolver name={iconItem.id} size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Badge Accent Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {COLOR_PRESETS.map((c) => {
                  const isSelected = selectedColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c,
                        border: isSelected ? '2px solid #ffffff' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 0 10px ${c}` : 'none',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      {isSelected && <Check size={14} color="#ffffff" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
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
                className="glass-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="glass-btn glass-btn-primary">
                Save Shortcut
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
