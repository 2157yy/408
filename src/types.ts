export type StudyStep = { title: string; body: string };

export type Question = {
  id: string;
  year: number;
  subject: string;
  subjectKey: string;
  group: string;
  summary: string;
  prompt?: string;
  promptHtml?: string;
  promptBlocks?: { type: 'html' | 'image'; content: string }[];
  choices?: { key: string; text: string }[];
  correctAnswers?: string[];
  answerText?: string;
  visual?: boolean;
  questionImages?: string[];
  family: string;
  familyTitle: string;
  steps: StudyStep[];
  answerCheck: string;
  pitfall: string;
  bookRef: string;
  figures: string[];
  source: string;
  recall: boolean;
};

export type FigureNote = { title: string; caption: string; plain: string };
