import fs from 'fs';
import path from 'path';

// Memory fallback for serverless execution
let memoryVisibility = {
  hiddenProjects: [] as string[],
  hiddenSubProjects: [] as string[],
  updatedAt: 0,
};

const filePath = '/tmp/visibility.json';

function loadState() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.hiddenProjects)) memoryVisibility.hiddenProjects = parsed.hiddenProjects;
      if (Array.isArray(parsed.hiddenSubProjects)) memoryVisibility.hiddenSubProjects = parsed.hiddenSubProjects;
      if (typeof parsed.updatedAt === 'number') memoryVisibility.updatedAt = parsed.updatedAt;
    }
  } catch (err) {
    console.error('Error reading /tmp/visibility.json:', err);
  }
  return memoryVisibility;
}

function saveState(state: { hiddenProjects: string[]; hiddenSubProjects: string[]; updatedAt: number }) {
  memoryVisibility = state;
  try {
    fs.writeFileSync(filePath, JSON.stringify(state), 'utf-8');
  } catch (err) {
    console.error('Error writing /tmp/visibility.json:', err);
  }
}

export default function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(loadState());
  }

  if (req.method === 'POST') {
    const { hiddenProjects, hiddenSubProjects, updatedAt } = req.body || {};
    const current = loadState();
    const incomingTs = typeof updatedAt === 'number' ? updatedAt : Date.now();

    if (current.updatedAt > 0 && incomingTs < current.updatedAt) {
      return res.status(200).json(current);
    }

    const updated = {
      hiddenProjects: Array.isArray(hiddenProjects) ? hiddenProjects : current.hiddenProjects,
      hiddenSubProjects: Array.isArray(hiddenSubProjects) ? hiddenSubProjects : current.hiddenSubProjects,
      updatedAt: incomingTs,
    };

    saveState(updated);
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
