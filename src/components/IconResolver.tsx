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
  SiFirebase,
  SiGoogleplay,
  SiGoogledrive,
  SiTradingview,
  SiGooglenews,
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
  SiFirebase,
  SiGoogleplay,
  SiGoogledrive,
  SiTradingview,
  SiGooglenews,
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
