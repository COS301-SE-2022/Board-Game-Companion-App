import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'board-game-details',
    loadChildren: () => import('./board-game-details/board-game-details.module').then(m=>m.BoardGameDetailsModule),
  },
  {
    path: 'board-game-search',
    loadChildren: () => import('./board-game-search/board-game-search.module').then(m=>m.BoardGameSearchModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m=>m.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./google-login/google-login.module').then(m=>m.LoginModule),
  },
  {
    path: 'collections',
    loadChildren: () => import('./collections/collections.module').then(m=>m.CollectionsModule),
  },
  {
    path: 'script-detail',
    loadChildren: () => import('./script-detail/script-detail.module').then(m=>m.ScriptDetailModule),
  },
  {
    path: 'editor',
    loadChildren: () => import('./editor/editor.module').then(m=>m.ScriptEditorModule)
  },
  {
    path: 'scripts',
    loadChildren: () => import ('./scripts/scripts.module').then(m=>m.ScriptsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule)
  },
  {
    path: 'gameSessions',
    loadChildren: () => import('./game-sessions/game-sessions.module').then(m=>m.GameSessionsModule)
  },
  {
    path: 'models',
    loadChildren: () => import('./models/models.module').then(m=>m.ModelsModule)
  },
  {
    path: 'script-exec',
    loadChildren: () => import('./script-executor/script-executor.module').then(m=>m.ScriptExecutorModule)
  },
  {
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m=>m.SessionModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),FormsModule],
  exports: [RouterModule]
})
export class ClientLibRoutingModule { }
