/// <reference types="vite/client" />

declare module 'virtual:projects-media' {
  import type { RawFolderScanInput } from './utils/folderParser';
  const scannedFolders: RawFolderScanInput[];
  export default scannedFolders;
}
