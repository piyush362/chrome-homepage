export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  error?: string;
}

export function validateAndNormalizeUrl(rawUrl: string): UrlValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      normalizedUrl: '',
      error: 'URL cannot be empty.',
    };
  }

  // Prepend https:// if protocol is missing
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    // Ensure there is a valid hostname containing at least one dot (e.g. google.com) or localhost
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return {
        isValid: false,
        normalizedUrl: candidate,
        error: 'Please enter a valid domain (e.g. youtube.com).',
      };
    }

    return {
      isValid: true,
      normalizedUrl: candidate,
    };
  } catch {
    return {
      isValid: false,
      normalizedUrl: candidate,
      error: 'Invalid URL format.',
    };
  }
}

export function extractDomain(url: string): string {
  try {
    const candidate = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(candidate);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
