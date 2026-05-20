// MyProjects store — user-authored AI projects added via the "我的AI项目" page.
//
// Persistence is localStorage-only for now; this keeps the experimental feature
// from widening the Rust AppSettings struct in echobird_core. When the feature
// stabilises and we need cross-device sync or richer launch metadata, we can
// migrate to ~/.echobird/projects.json via a Tauri command without changing
// the public API of this store.
import { create } from 'zustand';

export interface MyProject {
  id: string;
  name: string;
  /** Absolute path to icon (.ico / .svg / .png). Empty string = use default placeholder. */
  iconPath: string;
  /** Absolute path to launcher executable. */
  launcherPath: string;
  /** Absolute path to the project's models.json (model-field read/write mapping). */
  modelsJsonPath: string;
  createdAt: number;
}

export type MyProjectInput = Omit<MyProject, 'id' | 'createdAt'>;

const LS_KEY = 'echobird_my_projects';

const loadFromStorage = (): MyProject[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop entries missing required fields rather than crashing on a bad LS write.
    return parsed.filter(
      (p): p is MyProject =>
        typeof p === 'object' &&
        p !== null &&
        typeof (p as MyProject).id === 'string' &&
        typeof (p as MyProject).name === 'string' &&
        typeof (p as MyProject).launcherPath === 'string' &&
        typeof (p as MyProject).modelsJsonPath === 'string'
    );
  } catch {
    return [];
  }
};

const saveToStorage = (projects: MyProject[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(projects));
  } catch {
    /* private mode / quota — silently drop */
  }
};

// Slug-from-name id is human-readable in localStorage and easy to debug, but we
// append a short random suffix so two projects with the same name don't collide.
const makeId = (name: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  const rnd = Math.random().toString(36).slice(2, 8);
  return slug ? `${slug}-${rnd}` : `project-${rnd}`;
};

interface MyProjectsState {
  projects: MyProject[];
  addProject: (input: MyProjectInput) => MyProject;
  updateProject: (id: string, patch: Partial<MyProjectInput>) => void;
  deleteProject: (id: string) => void;
  init: () => void;
}

export const useMyProjectsStore = create<MyProjectsState>((set, get) => ({
  projects: [],
  addProject: (input) => {
    const project: MyProject = {
      ...input,
      id: makeId(input.name),
      createdAt: Date.now(),
    };
    const next = [...get().projects, project];
    saveToStorage(next);
    set({ projects: next });
    return project;
  },
  updateProject: (id, patch) => {
    const next = get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
    saveToStorage(next);
    set({ projects: next });
  },
  deleteProject: (id) => {
    const next = get().projects.filter((p) => p.id !== id);
    saveToStorage(next);
    set({ projects: next });
  },
  init: () => {
    set({ projects: loadFromStorage() });
  },
}));
