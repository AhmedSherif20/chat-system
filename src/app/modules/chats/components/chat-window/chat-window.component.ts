/**
 * Component responsible for displaying a chat window for messaging with a selected user.
 * Manages message retrieval, sending, and UI interactions such as toggling the chat list.
 */
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
  /** Service for managing and retrieving the current user state. */
  private userStateService: UserStateService = inject(UserStateService);

  /** Service for managing SignalR connections and message-related operations. */
  private signalRService: SignalRService = inject(SignalRService);

  /**
   * The selected user to chat with.
   * Contains the user's ID and username.
   */
  @Input() selectedUser: { id: string; userName: string } | null = null;

  /**
   * Event emitter to toggle the visibility of the chat list.
   * Emits a boolean value indicating whether the chat list should be shown.
   */
  @Output() showChatsList: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /** Information about the currently logged-in user. */
  senderInfo: User | null = this.userStateService.getUserFromStorage();

  /** ID of the receiver (the selected user). */
  receiverId: string = ``;

  /** ID of the sender (the current user). */
  senderId: string = ``;

  /** Observable containing the list of messages for the current chat. */
  messages$: Observable<Message[]> = this.signalRService.messages$;

  /** The content of the new message being composed by the user. */
  newMessage: string = '';

  /** Flag indicating whether messages are being loaded. */
  loading: boolean = false;

  /**
   * Lifecycle hook that is triggered when the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Lifecycle hook that is triggered when any bound input property changes.
   * Calls `initChat` to initialize the chat when the selected user changes.
   */
  ngOnChanges(): void {
    this.initChat();
  }

  /**
   * Initializes the chat with the selected user.
   * Sets the receiver and sender IDs and retrieves the chat messages.
   */
  async initChat(): Promise<void> {
    if (this.selectedUser && this.senderInfo) {
      this.receiverId = this.selectedUser.id;
      this.senderId = this.senderInfo.id;
      await this.getChatMessages();
    }
  }

  /**
   * Retrieves the chat messages between the current user and the selected user.
   * Scrolls the chat window to the bottom after messages are loaded.
   */
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

  /**
   * Listener for the `Escape` key event.
   * Clears the selected user when the `Escape` key is pressed.
   *
   * @param event The keyboard event triggered by pressing a key.
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.selectedUser = null;
  }

  /**
   * Sends a message to the selected user.
   * Also sends a notification to the receiver.
   * Clears the message input field after sending.
   */
  async sendMessage(): Promise<void> {
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

  /**
   * Toggles the visibility of the chat list by emitting an event.
   */
  showChats(): void {
    this.showChatsList.emit(true);
  }
}
