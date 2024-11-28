import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { User } from '../../../../interfaces/User';
import { UserStateService } from '../../../../services/user state/user-state.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements OnInit {
  private messagesService: MessagesService = inject(MessagesService);
  private userStateService: UserStateService = inject(UserStateService);
  private notificationsService: NotificationsService =
    inject(NotificationsService);
  selectedUser: { id: string; userName: string } | null = null;
  senderInfo: User | null = this.userStateService.getUserFromStorage();

  ngOnInit(): void {
    this.startConnection();
  }

  async startConnection(): Promise<void> {
    await this.messagesService.startConnection(this.senderInfo?.id ?? '');
    this.messagesService.onReceiveMessage();
    this.notificationsService.listenToNotifications();
  }
}
