// MyProjects page — user-authored AI projects launchable via EchoBird.
//
// Mirrors the AppManager visual language (card grid + selected-tool detail)
// but with a localStorage-backed user project list instead of bundled tools.
// Cards show launcher + models.json path; the model id displayed in "模型: …"
// is filled in once we add the Rust read_active_model command for user
// projects (deferred to a follow-up turn — placeholder shows "—" for now).
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Folder, Pencil, Trash2, X, FolderHeart } from 'lucide-react';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useI18n } from '../../hooks/useI18n';
import {
  useMyProjectsStore,
  type MyProject,
  type MyProjectInput,
} from '../../stores/myProjectsStore';
import { useToast } from '../../components/Toast';

// ── Reversi template (bundled at frontend build, written into clipboard
// when the user clicks "Copy Reversi template"). Identical to
// tools/reversi/models.json minus the docs field; the only intent is to
// give a Vibe-Coding starter a complete read/write mapping to crib from. ──
const REVERSI_MODELS_TEMPLATE = `{
  "configFile": "~/.echobird/myproject.json",
  "format": "json",
  "read": {
    "model": ["model"],
    "baseUrl": ["openai.baseUrl", "baseUrl"],
    "apiKey": ["openai.apiKey", "apiKey"]
  },
  "write": {
    "model": "model",
    "openai.baseUrl": "baseUrl",
    "openai.apiKey": "apiKey",
    "anthropic.baseUrl": "baseUrl",
    "anthropic.apiKey": "apiKey"
  }
}
`;

// ── Card grid + dialog wiring ──

export const MyProjectsMain: React.FC = () => {
  const { t } = useI18n();
  const projects = useMyProjectsStore((s) => s.projects);
  const initStore = useMyProjectsStore((s) => s.init);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    initStore();
  }, [initStore]);

  const openAdd = () => {
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (id: string) => {
    setEditingId(id);
    setDialogOpen(true);
  };
  const closeDialog = () => setDialogOpen(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Cards grid - Scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={openEdit} />
          ))}
          {/* "+" empty card — always last */}
          <button
            onClick={openAdd}
            className="relative p-5 border border-dashed border-cyber-border rounded-card bg-cyber-surface/40 flex flex-col items-center justify-center min-h-[160px] text-cyber-text-secondary hover:text-cyber-text hover:border-cyber-text/40 hover:bg-cyber-surface transition-colors outline-none"
          >
            <Plus size={28} className="mb-2" />
            <span className="text-[14px] font-medium">{t('myProjects.empty.title')}</span>
            <span className="text-[12px] mt-1 text-cyber-text-muted">
              {t('myProjects.empty.hint')}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom hint (orange instructional text — matches mockup) */}
      <div className="flex-shrink-0 pt-4 text-[13px] text-cyber-accent leading-relaxed">
        {t('myProjects.bottomHint')}
      </div>

      {dialogOpen && (
        <AddProjectDialog
          editingId={editingId}
          onClose={closeDialog}
          templateContent={REVERSI_MODELS_TEMPLATE}
        />
      )}
    </div>
  );
};

// ── Individual project card ──

const ProjectCard: React.FC<{
  project: MyProject;
  onEdit: (id: string) => void;
}> = ({ project, onEdit }) => {
  const { t } = useI18n();
  const deleteProject = useMyProjectsStore((s) => s.deleteProject);

  return (
    <div className="relative p-5 border border-cyber-border rounded-card bg-cyber-surface flex flex-col min-h-[160px] group hover:border-cyber-text/30 transition-colors">
      {/* Icon top-right — falls back to FolderHeart if user didn't pick one */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-cyber-elevated flex items-center justify-center overflow-hidden">
        {project.iconPath ? (
          // convertFileSrc would be cleaner once we add asset protocol; for now
          // a plain file:// URL works for Tauri WebView2 when AssetProtocol is on.
          // Falls back to placeholder on error.
          <img
            src={`file://${project.iconPath.replace(/\\/g, '/')}`}
            alt=""
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <FolderHeart size={20} className="text-cyber-text-secondary" />
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-cyber-text mb-4 pr-12 truncate">
        {project.name}
      </h3>

      <div className="space-y-1.5 text-[12px] text-cyber-text-secondary flex-1">
        <div className="truncate">
          <span className="text-cyber-text-muted">模型: </span>
          <span>—</span>
        </div>
        <div className="truncate" title={project.launcherPath}>
          <span className="text-cyber-text-muted">应用: </span>
          <span>{project.launcherPath || '—'}</span>
        </div>
        <div className="truncate" title={project.modelsJsonPath}>
          <span className="text-cyber-text-muted">配置: </span>
          <span>{project.modelsJsonPath || '—'}</span>
        </div>
      </div>

      {/* Actions row — replaces the "版本: 1.0" line in the original
          AppManager-style card. Visible on hover for tidiness. */}
      <div className="flex items-center justify-end gap-2 mt-3 opacity-70 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(project.id)}
          className="text-[12px] text-cyber-text-secondary hover:text-cyber-text px-2 py-0.5 rounded hover:bg-cyber-elevated transition-colors flex items-center gap-1"
        >
          <Pencil size={12} />
          {t('btn.edit')}
        </button>
        <button
          onClick={() => deleteProject(project.id)}
          className="text-[12px] text-cyber-text-secondary hover:text-cyber-error px-2 py-0.5 rounded hover:bg-cyber-elevated transition-colors flex items-center gap-1"
        >
          <Trash2 size={12} />
          {t('btn.delete')}
        </button>
      </div>
    </div>
  );
};

// ── Add / Edit dialog ──

const AddProjectDialog: React.FC<{
  editingId: string | null;
  onClose: () => void;
  templateContent: string;
}> = ({ editingId, onClose, templateContent }) => {
  const { t } = useI18n();
  const { showToast } = useToast();
  const projects = useMyProjectsStore((s) => s.projects);
  const addProject = useMyProjectsStore((s) => s.addProject);
  const updateProject = useMyProjectsStore((s) => s.updateProject);

  // Initial values: empty (Add) or existing project (Edit).
  const existing = editingId ? projects.find((p) => p.id === editingId) : null;
  const [name, setName] = useState(existing?.name ?? '');
  const [iconPath, setIconPath] = useState(existing?.iconPath ?? '');
  const [launcherPath, setLauncherPath] = useState(existing?.launcherPath ?? '');
  const [modelsJsonPath, setModelsJsonPath] = useState(existing?.modelsJsonPath ?? '');

  // ESC closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const pickFile = useCallback(
    async (filters: { name: string; extensions: string[] }[], setter: (v: string) => void) => {
      try {
        const result = await openDialog({ multiple: false, filters });
        if (typeof result === 'string') setter(result);
      } catch (e) {
        console.error('[MyProjects] file picker failed:', e);
      }
    },
    []
  );

  const handleCopyTemplate = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(templateContent);
      showToast('success', t('myProjects.templateCopied'));
    } catch {
      // Clipboard API can fail on some platforms / contexts — silently no-op
      // rather than crash the dialog.
    }
  }, [templateContent, showToast, t]);

  const canSave = name.trim().length > 0 && launcherPath && modelsJsonPath;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    const input: MyProjectInput = {
      name: name.trim(),
      iconPath,
      launcherPath,
      modelsJsonPath,
    };
    if (editingId) {
      updateProject(editingId, input);
    } else {
      addProject(input);
    }
    onClose();
  }, [
    canSave,
    name,
    iconPath,
    launcherPath,
    modelsJsonPath,
    editingId,
    updateProject,
    addProject,
    onClose,
  ]);

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-[480px] max-w-[92vw] border border-cyber-border/40 bg-cyber-surface shadow-2xl rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-px w-full bg-cyber-border" />
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-cyber-text font-mono">
            &gt;_ {t('myProjects.dialog.title')}
          </span>
          <button
            onClick={onClose}
            className="text-cyber-text-secondary hover:text-cyber-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <FieldLabel label={t('myProjects.field.name')}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('myProjects.placeholder.name')}
              className="w-full px-3 py-2 bg-cyber-input border border-cyber-border rounded text-[14px] text-cyber-text placeholder:text-cyber-text-muted focus:border-cyber-text/40 transition-colors outline-none"
            />
          </FieldLabel>

          <FieldLabel label={t('myProjects.field.icon')}>
            <FilePickerButton
              value={iconPath}
              placeholder={t('myProjects.pickFile')}
              onClick={() =>
                pickFile([{ name: 'Icon', extensions: ['ico', 'svg', 'png'] }], setIconPath)
              }
            />
          </FieldLabel>

          <FieldLabel label={t('myProjects.field.launcher')}>
            <FilePickerButton
              value={launcherPath}
              placeholder={t('myProjects.pickFile')}
              onClick={() =>
                pickFile(
                  // Windows: filter to exe. Other platforms: no filter (let user
                  // pick any executable — .app bundle on macOS is a directory
                  // and the dialog handles that natively).
                  navigator.platform.toLowerCase().includes('win')
                    ? [{ name: 'Executable', extensions: ['exe'] }]
                    : [],
                  setLauncherPath
                )
              }
            />
          </FieldLabel>

          <FieldLabel label={t('myProjects.field.models')}>
            <FilePickerButton
              value={modelsJsonPath}
              placeholder={t('myProjects.pickFile')}
              onClick={() =>
                pickFile([{ name: 'models.json', extensions: ['json'] }], setModelsJsonPath)
              }
            />
          </FieldLabel>

          <button
            onClick={handleCopyTemplate}
            className="w-full text-[12px] text-cyber-text-secondary hover:text-cyber-accent border border-cyber-border hover:border-cyber-accent/40 rounded px-3 py-2 transition-colors flex items-center justify-center gap-2 outline-none"
          >
            <Folder size={12} />
            {t('myProjects.copyTemplate')}
          </button>
        </div>

        <div className="flex border-t border-cyber-border/40">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-[14px] text-cyber-text-secondary hover:text-cyber-text hover:bg-cyber-elevated transition-colors"
          >
            {t('btn.cancel')}
          </button>
          <div className="w-px bg-cyber-border/40" />
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 px-6 py-3 text-[14px] text-cyber-text hover:bg-cyber-elevated transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('btn.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Small helpers ──

const FieldLabel: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1.5">
    <div className="text-[13px] text-cyber-text-secondary font-medium">{label}</div>
    {children}
  </div>
);

const FilePickerButton: React.FC<{
  value: string;
  placeholder: string;
  onClick: () => void;
}> = ({ value, placeholder, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full px-3 py-2 bg-cyber-input border border-cyber-border rounded text-[13px] text-left flex items-center justify-between gap-2 hover:border-cyber-text/40 transition-colors outline-none"
    title={value || placeholder}
  >
    <span className={`truncate ${value ? 'text-cyber-text' : 'text-cyber-text-muted'}`}>
      {value || placeholder}
    </span>
    <Folder size={14} className="flex-shrink-0 text-cyber-text-secondary" />
  </button>
);
