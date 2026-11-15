/**
 * Normalizes image paths to prevent 404 errors on sub-routes and relative paths.
 * Handles paths like:
 * - "./projects-media/foo.png" -> "/projects-media/foo.png"
 * - "projects-media/foo.png" -> "/projects-media/foo.png"
 * - "./public/projects-media/foo.png" -> "/projects-media/foo.png"
 * - "public/projects-media/foo.png" -> "/projects-media/foo.png"
 * - "/public/projects-media/foo.png" -> "/projects-media/foo.png"
 * - "./public/about-media/foo.jpg" -> "/about-media/foo.jpg"
 * - "./about-media/foo.jpg" -> "/about-media/foo.jpg"
 * - "about-media/foo.jpg" -> "/about-media/foo.jpg"
 * - "./public/foo.png" -> "/foo.png"
 * - "public/foo.png" -> "/foo.png"
 * - "/public/foo.png" -> "/foo.png"
 */
export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  let cleaned = url.trim();

  // Handle leading dot-slash or dot
  if (cleaned.startsWith('./')) {
    cleaned = cleaned.substring(1); // becomes /projects-media/... or /public/...
  } else if (cleaned.startsWith('.')) {
    cleaned = cleaned.substring(1);
  }

  // Handle public/ or /public/ prefixes
  if (cleaned.startsWith('/public/')) {
    cleaned = cleaned.replace('/public/', '/');
  } else if (cleaned.startsWith('public/')) {
    cleaned = cleaned.replace('public/', '/');
  }

  // Ensure absolute path leading slash for relative asset paths
  if (
    !cleaned.startsWith('/') &&
    !cleaned.startsWith('http://') &&
    !cleaned.startsWith('https://') &&
    !cleaned.startsWith('data:')
  ) {
    cleaned = '/' + cleaned;
  }

  return cleaned;
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url.trim());
}

export function isSvgUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.svg(\?.*)?$/i.test(url.trim());
}

export function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.pdf(\?.*)?$/i.test(url.trim());
}
