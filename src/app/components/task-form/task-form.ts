import { Component, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Priority } from '../../models/task';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  taskSubmit = output<{ title: string; priority: Priority }>();

  onSubmit(form: NgForm) {
    const title = form.value.title?.trim();
    const priority = form.value.priority as Priority;

    if (!title) return;

    this.taskSubmit.emit({ title, priority });
    form.resetForm();
  }
}
