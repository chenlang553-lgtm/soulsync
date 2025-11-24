export enum AppView {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  CONSULTANT = 'CONSULTANT',
  ARCHIVE = 'ARCHIVE'
}

export interface SentimentPoint {
  index: number;
  label: string; // e.g., "Day 1" or "Msg 1-10"
  userScore: number; // -10 to 10
  partnerScore: number; // -10 to 10
  intimacyScore: number; // 0 to 100
}

export interface AnalysisResult {
  id: string;
  date: string;
  title: string;
  summary: string;
  sentimentTrend: SentimentPoint[];
  currentIntimacy: number;
  partnerPsychology: string;
  myPsychology: string;
  relationshipAdvice: string[];
  keyTopics: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ArchiveItem {
  id: string;
  date: string;
  title: string;
  preview: string;
}