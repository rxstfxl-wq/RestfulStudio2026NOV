import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { FALLBACK_PROJECTS } from '../data/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
          setLastSyncedAt(data.scannedAt || Date.now());
        }
      }
    } catch (err) {
      console.warn('Using static fallback project list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();

    const handleFocus = () => {
      refreshProjects();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshProjects]);

  return { projects, loading, lastSyncedAt, refreshProjects };
}
