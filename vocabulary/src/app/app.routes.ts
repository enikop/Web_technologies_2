import { Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { WordListComponent } from './word-list/word-list.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { TopicAddComponent } from './topic-add/topic-add.component';
import { TopicEditComponent } from './topic-edit/topic-edit.component';
import { TopicStatsComponent } from './topic-stats/topic-stats.component';
import { PracticeQuizComponent } from './practice-quiz/practice-quiz.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'topics'
  },
  {
    path: 'topics',
    component: TopicListComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'topics/:id',
    component: WordListComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'add-topic',
    component: TopicAddComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'edit-topic/:id',
    component: TopicEditComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'history',
    component: PracticeListComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'topics/stats/:id',
    component: TopicStatsComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'topics/practice/:id',
    component: PracticeQuizComponent,
    canActivate: [ () => inject(AuthService).preventGuestAccess() ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ () => inject(AuthService).preventAuthAccess() ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ () => inject(AuthService).preventAuthAccess() ]
  }
];
