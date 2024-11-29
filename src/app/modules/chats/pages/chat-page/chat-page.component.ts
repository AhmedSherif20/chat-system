import { Component, inject, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signal-r/signal-r.service';
import { User } from '../../../../interfaces/User';
import { UserStateService } from '../../../../services/user state/user-state.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent implements OnInit {
  private signalRService: SignalRService = inject(SignalRService);
  private userStateService: UserStateService = inject(UserStateService);

  selectedUser: { id: string; userName: string } | null = null;
  senderInfo: User | null = this.userStateService.getUserFromStorage();

  showChatList: boolean = false;

  ngOnInit(): void {
    this.startConnection();
  }

  async startConnection(): Promise<void> {
    await this.signalRService.startConnection(this.senderInfo?.id ?? '');
    this.signalRService.onReceiveMessage();
    this.signalRService.listenToNotifications();
  }
}
