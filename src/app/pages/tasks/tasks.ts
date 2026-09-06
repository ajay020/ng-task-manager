import { Component, inject } from '@angular/core';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskList } from '../../components/task-list/task-list';
import { TaskService } from '../../service/task';
import { Priority, Task } from '../../models/task';

@Component({
  selector: 'app-tasks',
  imports: [TaskForm, TaskList],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;

  handleChange(task: Task) {
    this.taskService.toggleTask(task);
  }

  onTaskAdd({ title, priority }: { title: string; priority: Priority }) {
    this.taskService.addTask({ title, priority });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task);
  }

  onEditTask(task: Task) {
    this.taskService.updateTask(task);
  }
}
