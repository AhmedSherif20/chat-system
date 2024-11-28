import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPageComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
