import { Folder as FolderIcon, FolderKanban } from 'lucide-react';
import { useBookmarkStore } from '../store/useBookmarkStore';

export const FolderNavigation: React.FC = () => {
  const {
    folders,
    activeFolderId,
    setActiveFolderId,
    setIsFolderManagerOpen,
  } = useBookmarkStore();

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '2px 0',
      }}
    >
      {/* Scrollable list of folder tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px',
          flex: 1,
        }}
      >
        {/* All view */}
        <button
          type="button"
          onClick={() => setActiveFolderId('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: activeFolderId === 'all'
              ? '1px solid var(--accent-primary)'
              : '1px solid var(--surface-border)',
            background: activeFolderId === 'all'
              ? 'var(--accent-glow)'
              : 'var(--glass-surface)',
            color: activeFolderId === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: activeFolderId === 'all' ? 600 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          <span>All</span>
        </button>

        {/* Individual Folders */}
        {folders.map((folder) => {
          const isActive = activeFolderId === folder.id;
          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => setActiveFolderId(folder.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: isActive
                  ? '1px solid var(--accent-primary)'
                  : '1px solid var(--surface-border)',
                background: isActive
                  ? 'var(--accent-glow)'
                  : 'var(--glass-surface)',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <FolderIcon
                size={13}
                style={{ color: folder.color || 'var(--accent-primary)' }}
              />
              <span>{folder.name}</span>
            </button>
          );
        })}
      </div>

      {/* Manage Folders button */}
      <button
        type="button"
        onClick={() => setIsFolderManagerOpen(true)}
        className="glass-button"
        style={{
          padding: '6px 10px',
          borderRadius: '9999px',
          fontSize: '12px',
          flexShrink: 0,
        }}
        title="Manage Folders"
      >
        <FolderKanban size={13} />
        <span style={{ display: 'none' }}>Folders</span>
      </button>
    </div>
  );
};
