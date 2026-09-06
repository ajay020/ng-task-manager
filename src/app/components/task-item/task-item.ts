import { Component, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task, Priority } from '../../models/task';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule, RouterLink],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  task = input.required<Task>();

  handleChange = output<Task>();
  deleteTask = output<Task>();
  editTask = output<Task>();

  showEditInput = signal<boolean>(false);

  onChange() {
    this.handleChange.emit(this.task());
  }

  onDelete() {
    this.deleteTask.emit(this.task());
  }

  toggleEditInput() {
    this.showEditInput.set(!this.showEditInput());
  }

  onEditSubmit(form: NgForm) {
    const title = form.value.title.trim();
    const priority = form.value.priority as Priority;

    if (!title) return;

    let updatedTask = { ...this.task(), title, priority };

    console.log('Updated task: ', updatedTask);

    this.editTask.emit(updatedTask);

    this.toggleEditInput();
  }
}
