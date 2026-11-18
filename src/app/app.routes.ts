import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Post } from './Pages/post/post';
import { authGuard } from './guards/auth-guard-guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'post', component: Post, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];