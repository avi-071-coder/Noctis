export interface DreamData {
  id: string;
  originalText: string;
  imageUrl: string;
  title: string;
  summary: string;
  emotions: Array<{ name: string; intensity: number; color: string }>;
  symbols: Array<{ name: string; meaning: string }>;
  storyboard: Array<{ scene: string; description: string }>;
  date: string;
}
