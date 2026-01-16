export type SubjectType = 'math' | 'physics' | 'cs' | 'other';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  isLoading?: boolean;
}

export interface Simulation {
  id: string;
  name: string;
  subject?: SubjectType;
  code: string; // The full HTML code
  timestamp: string;
}

export interface LibraryItem {
  name: string;
  title: string;
  subject?: SubjectType;
  html: string;
  timestamp: string;
}

export type GenerationStatus = 'idle' | 'analyzing' | 'proposing' | 'generating' | 'complete';