import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UserStateService } from '../../../../services/user state/user-state.service';
import { User } from '../../../../interfaces/User';
import { SignalRService } from '../../services/signal-r/signal-r.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Message } from '../../interfaces/Message';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
})
export class ChatWindowComponent implements OnInit, OnChanges {
  private userStateService: UserStateService = inject(UserStateService);
  private signalRService: SignalRService = inject(SignalRService);

  @Input() selectedUser: { id: string; userName: string } | null = null;
  @Output() showChatsList: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  senderInfo: User | null = this.userStateService.getUserFromStorage();

  receiverId: string = ``;
  senderId: string = ``;
  messages$: Observable<Message[]> = this.signalRService.messages$;

  newMessage: string = '';

  loading: boolean = false;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.initChat();
  }

  async initChat() {
    if (this.selectedUser && this.senderInfo) {
      this.receiverId = this.selectedUser.id;
      this.senderId = this.senderInfo.id;
      await this.getChatMessages();
    }
  }

  async getChatMessages(): Promise<void> {
    this.loading = true;
    const messagesResponse = await firstValueFrom(
      this.signalRService.getMessages(
        this.receiverId,
        this.senderInfo?.token ?? ''
      )
    );

    this.signalRService.scrollDown();

    this.loading = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.selectedUser = null;
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const message: string = this.newMessage.trim();
      await this.signalRService.sendMessage(
        this.senderInfo?.id ?? '',
        this.selectedUser.id,
        message
      );
      await this.signalRService.sendNotification(this.receiverId, message);
      this.newMessage = '';
    }
  }

  showChats() {
    this.showChatsList.emit(true);
  }
}
