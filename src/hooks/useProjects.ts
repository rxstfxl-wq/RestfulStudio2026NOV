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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
          setLastSyncedAt(data.scannedAt || Date.now());
        }
      }
    } catch (err) {
      console.warn('Using build-time public/projects-media snapshot:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();

    const handleFocus = () => {
      refreshProjects();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshProjects();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshProjects]);

  return { projects, loading, lastSyncedAt, refreshProjects };
}
