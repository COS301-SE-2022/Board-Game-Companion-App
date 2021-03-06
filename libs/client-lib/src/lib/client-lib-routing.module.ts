import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    path: 'addGame',
    loadChildren: () => import('./add-to-collection/add-to-collection.module').then(m=>m.AddToCollectionModule),
  },
  {
    path: 'script-detail',
    loadChildren: () => import('./script-detail/script-detail.module').then(m=>m.ScriptDetailModule),
  }
  ,
  {
    path: 'viewCollection',
    loadChildren: () => import('./view-collection/view-collection.module').then(m=>m.ViewCollectionModule),
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
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m=>m.SessionModule)

  },
  {
    path: 'models',
    loadChildren: () => import('./models/models.module').then(m=>m.ModelsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientLibRoutingModule { }
