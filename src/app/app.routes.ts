import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { TaskDetail } from './pages/task-detail/task-detail';

export const routes: Routes = [
  {
    path: 'tasks/:id',
    component: TaskDetail,
  },
  {
    path: 'tasks',
    component: Tasks,
  },
];
