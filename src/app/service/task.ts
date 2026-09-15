import { Injectable, signal, inject } from '@angular/core';
import { Task, Priority, TodoApiResponse } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, map, throwError } from 'rxjs';

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

  private tasks = signal<Task[]>(this.initialTasks);
  private loading = signal(true);
  private error = signal<string | null>(null);

  readonly taskList = this.tasks.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly taskError = this.error.asReadonly();

  private http = inject(HttpClient);

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
  getTask(id: number): Task | null {
    return this.tasks().find((t) => t.id === id) ?? null;
  }

  toggleTask(task: Task) {
    this.tasks.update((value) =>
      value.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
    );
  }

  addTask({ title, priority }: { title: string; priority: Priority }) {
    const newTask = {
      title,
      completed: false,
      priority,
    };

    this.http
      .post<TodoApiResponse>('https://jsonplaceholder.typicode.com/todos', newTask)
      .pipe(
        map((data) => ({
          id: data.id,
          title: data.title,
          completed: data.completed,
          priority,
        })),
        catchError((error) => {
          console.log('HTTP error:', error);
          this.error.set('Failed to add task.');

          return EMPTY;
        }),
      )
      .subscribe({
        next: (task) => {
          this.tasks.update((prev) => [task, ...prev]);
        },
      });
  }

  deleteTask(task: Task) {
    this.http
      .delete(`https://jsonplaceholder.typicode.com/todos/${task.id}`)
      .pipe(
        catchError((error) => {
          console.log('HTTP error:', error);
          this.error.set('Failed to DELETE task.');

          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.tasks.update((prev) => prev.filter((t) => t.id !== task.id));
        },
        error: (error) => {
          this.error.set('Failed to delete task.');
        },
      });
  }

  updateTask(task: Task) {
    this.http
      .put<TodoApiResponse>(`https://jsonplaceholder.typicode.com/todos/${task.id}`, task)
      .pipe(
        map((data) => ({
          id: data.id,
          title: data.title,
          completed: data.completed,
          priority: task.priority,
        })),
        catchError((error) => {
          console.log('HTTP error:', error);
          this.error.set('Failed to update task.');

          return EMPTY;
        }),
      )
      .subscribe({
        next: (data) => {
          this.tasks.update((value) => value.map((t) => (t.id === data.id ? data : t)));
        },
      });
  }
}
