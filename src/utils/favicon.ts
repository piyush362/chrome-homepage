import { extractDomain } from './validateUrl';

export function getFaviconUrl(url: string, customFaviconUrl?: string): string {
  if (customFaviconUrl && customFaviconUrl.trim()) {
    return customFaviconUrl.trim();
  }

  const domain = extractDomain(url);
  if (!domain) return '';

  // Google High-Res Favicon service
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// Map common domains to brand colors and fallback icon identifiers
export interface BrandMeta {
  color: string;
  brandIconKey?: string;
  title: string;
}

export const BRAND_DIRECTORY: Record<string, BrandMeta> = {
  'play.google.com': { color: '#01875f', brandIconKey: 'SiGoogleplay', title: 'Play Console' },
  'admob.google.com': { color: '#ea4335', brandIconKey: 'SiGoogle', title: 'AdMob' },
  'firebase.google.com': { color: '#ffca28', brandIconKey: 'SiFirebase', title: 'Firebase' },
  'zinghr.com': { color: '#0052cc', title: 'ZingHR' },
  'news.google.com': { color: '#4285f4', brandIconKey: 'SiGooglenews', title: 'Google News' },
  'chittorgarh.com': { color: '#e11d48', title: 'IPO Live' },
  'ipowatch.in': { color: '#e11d48', title: 'IPO Live' },
  'nseindia.com': { color: '#ea580c', title: 'NSE India' },
  'moneycontrol.com': { color: '#0284c7', title: 'Moneycontrol' },
  'ilovepdf.com': { color: '#e11d48', title: 'iLovePDF' },
  'smallpdf.com': { color: '#0d9488', title: 'Smallpdf' },
  'drive.google.com': { color: '#34a853', brandIconKey: 'SiGoogledrive', title: 'Drive' },
  'tradingview.com': { color: '#2962ff', brandIconKey: 'SiTradingview', title: 'TradingView' },
  'youtube.com': { color: '#ef4444', brandIconKey: 'SiYoutube', title: 'YouTube' },
  'google.com': { color: '#4285f4', brandIconKey: 'SiGoogle', title: 'Google' },
  'mail.google.com': { color: '#ea4335', brandIconKey: 'SiGmail', title: 'Gmail' },
  'github.com': { color: '#a855f7', brandIconKey: 'SiGithub', title: 'GitHub' },
  'reddit.com': { color: '#f97316', brandIconKey: 'SiReddit', title: 'Reddit' },
  'instagram.com': { color: '#ec4899', brandIconKey: 'SiInstagram', title: 'Instagram' },
  'chatgpt.com': { color: '#10b981', brandIconKey: 'SiOpenai', title: 'ChatGPT' },
  'x.com': { color: '#ffffff', brandIconKey: 'SiX', title: 'X' },
  'wikipedia.org': { color: '#cbd5e1', brandIconKey: 'SiWikipedia', title: 'Wikipedia' },
  'spotify.com': { color: '#22c55e', brandIconKey: 'SiSpotify', title: 'Spotify' },
};
