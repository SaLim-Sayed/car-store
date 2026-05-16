/** Normalize image paths for next/image; returns null if unusable. */
export function resolveImageSrc(src?: string | null): string | null {
 if (!src || typeof src !== 'string') return null;

 const trimmed = src.trim();
 if (!trimmed) return null;

 // Skip inline data URLs (often huge/invalid for Image optimizer)
 if (trimmed.startsWith('data:')) return null;

 try {
 if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
 new URL(trimmed);
 return trimmed;
 }

 if (trimmed.startsWith('/')) {
 return trimmed;
 }

 return `/${trimmed.replace(/^\/+/, '')}`;
 } catch {
 return null;
 }
}

export function pickFirstImage(...sources: (string | undefined | null)[]): string | null {
 for (const src of sources) {
 const resolved = resolveImageSrc(src);
 if (resolved) return resolved;
 }
 return null;
}
