import {
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { UserStateService } from '../../../../services/user state/user-state.service';
import { User } from '../../../../interfaces/User';
import { MessagesService } from '../../services/messages/messages.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Message } from '../../interfaces/Message';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
})
export class ChatWindowComponent implements OnInit, OnChanges {
  private userStateService: UserStateService = inject(UserStateService);
  private messagesService: MessagesService = inject(MessagesService);

  @Input() selectedUser: { id: string; userName: string } | null = null;

  senderInfo: User | null = this.userStateService.getUserFromStorage();

  receiverId: string = ``;
  senderId: string = ``;
  messages$: Observable<Message[]> = this.messagesService.messages$;

  newMessage: string = '';

  loading: boolean = false;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.initChat();
  }

  async initChat() {
    if (this.selectedUser && this.senderInfo) {
      console.log(this.selectedUser);
      console.log(this.senderInfo);

      this.receiverId = this.selectedUser.id;
      this.senderId = this.senderInfo.id;
      await this.getChatMessages();
    }
  }

  async getChatMessages(): Promise<void> {
    this.loading = true;
    const messagesResponse = await firstValueFrom(
      this.messagesService.getMessages(
        this.receiverId,
        this.senderInfo?.token ?? ''
      )
    );

    this.messagesService.scrollDown();
    console.log(messagesResponse);

    this.loading = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.selectedUser = null;
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const message: string = this.newMessage.trim();
      await this.messagesService.sendMessage(
        this.senderInfo?.id ?? '',
        this.selectedUser.id,
        message
      );
      await this.messagesService.sendNotification(this.receiverId, message);
      this.newMessage = '';
    }
  }
}
