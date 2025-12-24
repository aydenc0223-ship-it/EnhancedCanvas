export interface Assignment {
  id: string;
  summary: string;
  description: string;
  startDate: Date;
  course: string; // Extracted from summary or category
  originalRaw: string;
}

export interface ClassGroup {
  courseName: string;
  assignments: Assignment[];
  isVisible: boolean;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
