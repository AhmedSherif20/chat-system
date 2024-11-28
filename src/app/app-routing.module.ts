import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { GuestGuard } from './guards/guest/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [GuestGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'chats',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/chats/chats.module').then((m) => m.ChatsModule),
  },
  {
    path: '**',
    component: NotfoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
