import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { NavbarComponent } from '../../ui/global/navbar/navbar.component';
import { VideoCallComponent } from './components/video-call/video-call.component';

@NgModule({
  declarations: [
    ChatsListComponent,
    ChatWindowComponent,
    ChatPageComponent,
    VideoCallComponent,
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
  ],
})
export class ChatsModule {}
