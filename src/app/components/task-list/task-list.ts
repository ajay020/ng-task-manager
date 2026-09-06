import { Component, input, output, signal, computed } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskChange = output<Task>();
  taskDelete = output<Task>();
  editTask = output<Task>();

  tasks = input.required<Task[]>();

  filter = signal<'all' | 'active' | 'completed'>('all');
  searchTerm = signal('');

  filteredTasks = computed(() => {
    let tasks = this.tasks();
    const search = this.searchTerm().toLowerCase();

    if (search) {
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(search));
    }

    if (this.filter() === 'completed') {
      return tasks.filter((t) => t.completed);
    }

    if (this.filter() === 'active') {
      return tasks.filter((t) => !t.completed);
    }

    return tasks;
  });

  totalCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);
  activeCount = computed(() => this.tasks().filter((t) => !t.completed).length);

  selectFilter(value: 'all' | 'completed' | 'active') {
    this.filter.set(value);
  }
}
