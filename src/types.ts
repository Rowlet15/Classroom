export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'Arcade' | 'Action' | 'Puzzle' | 'Retro' | 'Sports' | 'Custom';
  iframeUrl: string;
  thumbnail: string;
  rating: number;
  plays: number;
  featured?: boolean;
  controls: string[];
  tags: string[];
  isCustom?: boolean;
  icon?: string;
  color?: string;
}

export type CategoryFilter = 'All' | 'Arcade' | 'Action' | 'Sports' | 'Puzzle' | 'Retro' | 'Favorites' | 'Recent';

export type SortOption = 'popular' | 'rating' | 'title';

export interface CloakPreset {
  id: string;
  name: string;
  title: string;
  iconSvg: string;
}
