/**
 * Component responsible for displaying the chat page.
 * Handles SignalR connections and chat-related functionality for the application.
 */
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
  /** Service to handle SignalR connections and real-time communication. */
  private signalRService: SignalRService = inject(SignalRService);

  /** Service to manage and retrieve the current user state. */
  private userStateService: UserStateService = inject(UserStateService);

  /**
   * The currently selected chat user.
   * Contains the user's ID and username.
   */
  selectedUser: { id: string; userName: string } | null = null;

  /**
   * Information about the sender (current user).
   * Retrieved from the user state service.
   */
  senderInfo: User | null = this.userStateService.getUserFromStorage();

  /**
   * Flag to toggle the visibility of the chat list.
   * Initially set to `false`.
   */
  showChatList: boolean = false;

  /**
   * Lifecycle hook that initializes the component.
   * Establishes the SignalR connection and sets up message/notification listeners.
   */
  ngOnInit(): void {
    this.startConnection();
  }

  /**
   * Starts the SignalR connection for the current user.
   * Initializes message and notification listeners.
   *
   * @returns A Promise that resolves when the connection is successfully established.
   */
  async startConnection(): Promise<void> {
    await this.signalRService.startConnection(this.senderInfo?.id ?? '');
    this.signalRService.onReceiveMessage();
    this.signalRService.listenToNotifications();
  }
}
