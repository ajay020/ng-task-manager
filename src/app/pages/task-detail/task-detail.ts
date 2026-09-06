import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../service/task';
import { Priority, Task } from '../../models/task';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  imports: [FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private router = inject(Router);
  taskId = signal<number | null>(null);
  showEditForm = signal(false);

  task = computed(() => {
    const id = this.taskId();

    if (id === null) {
      return null;
    }

    return this.taskService.getTask(id);
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.taskId.set(Number(params.get('id')));
    });
  }

  onBack() {
    this.router.navigate(['/tasks']);
  }

  toggleEditForm() {
    this.showEditForm.update((val) => !val);
  }

  onSubmit(form: NgForm) {
    const title = form.value.title.trim() as string;
    const priority = form.value.priority as Priority;

    if (!title || !this.task()) return;

    const updatedTask: Task = { ...this.task()!, title, priority };

    this.taskService.updateTask(updatedTask);

    this.toggleEditForm();
  }
}
