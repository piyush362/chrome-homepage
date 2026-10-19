import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Edit3, Folder as FolderIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useBookmarkStore } from '../store/useBookmarkStore';

export const FolderManagerModal: React.FC = () => {
  const {
    folders,
    isFolderManagerOpen,
    setIsFolderManagerOpen,
    addFolder,
    updateFolder,
    deleteFolder,
  } = useBookmarkStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!isFolderManagerOpen) return null;

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    toast.success(`Created folder "${newFolderName.trim()}"`);
    setNewFolderName('');
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingFolderId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    updateFolder(id, { name: editingName.trim() });
    toast.success('Folder renamed');
    setEditingFolderId(null);
  };

  const handleDeleteFolder = (id: string, name: string) => {
    if (folders.length <= 1) {
      toast.error('You must keep at least one folder.');
      return;
    }
    const { movedCount } = deleteFolder(id);
    if (movedCount > 0) {
      toast.info(`Deleted folder "${name}". Moved ${movedCount} shortcut${movedCount === 1 ? '' : 's'} to General.`);
    } else {
      toast.success(`Deleted folder "${name}"`);
    }
  };

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFolderManagerOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2 }}
          className="glass-surface"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '24px',
            position: 'relative',
            zIndex: 10000,
            maxHeight: '85vh',
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
              <FolderIcon size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                Manage Folders
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFolderManagerOpen(false)}
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

          {/* New Folder Form */}
          <form onSubmit={handleCreateFolder} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="New folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="glass-input-field"
              style={{ fontSize: '13px' }}
            />
            <button
              type="submit"
              className="glass-button glass-button-primary"
              style={{ flexShrink: 0 }}
            >
              <Plus size={15} />
              <span>Create</span>
            </button>
          </form>

          {/* Folder List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {folders.map((folder) => {
              const isEditing = editingFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--surface-border-subtle)',
                  }}
                >
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, marginRight: '8px' }}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="glass-input-field"
                        style={{ padding: '4px 8px', fontSize: '13px' }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(folder.id)}
                        className="glass-button glass-button-primary"
                        style={{ padding: '6px 8px' }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FolderIcon size={15} style={{ color: folder.color || 'var(--accent-primary)' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-main)' }}>
                        {folder.name}
                      </span>
                    </div>
                  )}

                  {!isEditing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleStartRename(folder.id, folder.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                        title="Rename folder"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFolder(folder.id, folder.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                        title="Delete folder"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
