import { Injectable, signal } from '@angular/core';
import { Task, Priority } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks = signal<Task[]>([
    { id: 1, title: 'Learn Angular', completed: false, priority: 'low' },
    { id: 2, title: 'Build Task Manager', completed: false, priority: 'low' },
    { id: 3, title: 'Practice TypeScript', completed: false, priority: 'low' },
    { id: 4, title: 'Apply for jobs', completed: false, priority: 'low' },
  ]);

  getTask(id: number): Task | null {
    return this.tasks().find((t) => t.id === id) ?? null;
  }

  toggleTask(task: Task) {
    this.tasks.update((value) =>
      value.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
    );
  }

  addTask({ title, priority }: { title: string; priority: Priority }) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      priority,
    };

    this.tasks.update((prev) => [...prev, newTask]);
  }

  deleteTask(task: Task) {
    this.tasks.update((prev) => prev.filter((t) => t.id !== task.id));
  }

  updateTask(task: Task) {
    this.tasks.update((value) => value.map((t) => (t.id === task.id ? task : t)));
  }
}
