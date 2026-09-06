export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority?: Priority;
}

export type Priority = 'low' | 'medium' | 'high';
