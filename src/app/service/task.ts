import { Injectable, signal, effect, inject } from '@angular/core';
import { Task, Priority, TodoApiResponse } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  initialTasks: Task[] = [
    {
      id: 1,
      title: 'Learn Angular',
      completed: false,
      priority: 'low',
    },
    {
      id: 2,
      title: 'Build Task Manager',
      completed: false,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Practice TypeScript',
      completed: false,
      priority: 'low',
    },
    {
      id: 4,
      title: 'Apply for jobs',
      completed: false,
      priority: 'high',
    },
  ];

  tasks = signal<Task[]>(this.loadStoredTasks() ?? this.initialTasks);
  loading = signal(true);
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  constructor() {
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    });
  }

  loadTasks() {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<TodoApiResponse[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        map((data) =>
          data.map((task) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: 'low' as Priority,
          })),
        ),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.loading.set(false);
        },

        error: () => {
          this.error.set('Failed to load tasks.');
          this.loading.set(false);
        },
      });
  }

  private loadStoredTasks(): Task[] | null {
    const storedTasks = localStorage.getItem('tasks');

    if (!storedTasks) {
      return null;
    }

    try {
      return JSON.parse(storedTasks);
    } catch {
      return null;
    }
  }

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
