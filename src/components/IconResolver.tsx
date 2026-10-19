import React from 'react';
import {
  SiGithub,
  SiYoutube,
  SiReddit,
  SiGoogle,
  SiX,
  SiFigma,
  SiNotion,
  SiSpotify,
  SiTwitch,
  SiDiscord,
  SiNetflix,
  SiDuckduckgo,
  SiPerplexity,
} from 'react-icons/si';
import { FaAmazon, FaLinkedin } from 'react-icons/fa6';
import {
  Globe,
  Code2,
  Bookmark,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Tv,
  Music,
  ShoppingBag,
  Compass,
} from 'lucide-react';

interface IconResolverProps {
  name?: string;
  className?: string;
  size?: number;
  color?: string;
}

const BRAND_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number; color?: string }>> = {
  SiGithub,
  SiYoutube,
  SiReddit,
  SiGoogle,
  SiX,
  SiFigma,
  SiNotion,
  SiSpotify,
  SiTwitch,
  SiDiscord,
  SiNetflix,
  SiDuckduckgo,
  SiPerplexity,
  FaAmazon,
  FaLinkedin,
};

const LUCIDE_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number; color?: string }>> = {
  Globe,
  Code2,
  Bookmark,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Tv,
  Music,
  ShoppingBag,
  Compass,
};

export const AVAILABLE_ICONS = [
  { id: 'SiGoogle', label: 'Google', type: 'brand' },
  { id: 'SiGithub', label: 'GitHub', type: 'brand' },
  { id: 'SiYoutube', label: 'YouTube', type: 'brand' },
  { id: 'SiReddit', label: 'Reddit', type: 'brand' },
  { id: 'SiX', label: 'X (Twitter)', type: 'brand' },
  { id: 'SiFigma', label: 'Figma', type: 'brand' },
  { id: 'SiNotion', label: 'Notion', type: 'brand' },
  { id: 'SiSpotify', label: 'Spotify', type: 'brand' },
  { id: 'SiDiscord', label: 'Discord', type: 'brand' },
  { id: 'SiNetflix', label: 'Netflix', type: 'brand' },
  { id: 'FaLinkedin', label: 'LinkedIn', type: 'brand' },
  { id: 'SiPerplexity', label: 'Perplexity / AI', type: 'brand' },
  { id: 'FaAmazon', label: 'Amazon', type: 'brand' },
  { id: 'Globe', label: 'Website / Web', type: 'lucide' },
  { id: 'Code2', label: 'Code', type: 'lucide' },
  { id: 'Sparkles', label: 'Magic / Tools', type: 'lucide' },
  { id: 'Music', label: 'Audio', type: 'lucide' },
  { id: 'Tv', label: 'Video / Streams', type: 'lucide' },
  { id: 'ShoppingBag', label: 'Shopping', type: 'lucide' },
  { id: 'Terminal', label: 'Terminal', type: 'lucide' },
];

export const IconResolver: React.FC<IconResolverProps> = ({
  name,
  className = '',
  size = 20,
  color,
}) => {
  if (!name) {
    return <Globe size={size} className={className} style={color ? { color } : undefined} />;
  }

  // Check brand icons from react-icons
  if (name in BRAND_ICONS) {
    const Component = BRAND_ICONS[name];
    return <Component size={size} className={className} color={color} />;
  }

  // Check Lucide icons
  if (name in LUCIDE_ICONS) {
    const Component = LUCIDE_ICONS[name];
    return <Component size={size} className={className} color={color} />;
  }

  // Default fallback
  return <Globe size={size} className={className} style={color ? { color } : undefined} />;
};
