import { inject, Injectable } from '@angular/core';
import { Vars } from '../../../../enums/vars';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GetChatMessagesResponse } from '../../interfaces/GetChatMessagesReponse';
import { Message } from '../../interfaces/Message';

/**
 * A service to manage SignalR connections, real-time messaging, and notifications.
 * This service provides functionality to establish SignalR connections,
 * send and receive messages, and handle notifications in a chat application.
 */
@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = Vars.baseUrl;
  private hubConnection: signalR.HubConnection;

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  /**
   * Observable stream for chat messages.
   */
  messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  private receivedSignalSubject = new BehaviorSubject<string | null>(null);
  /**
   * Observable stream for received signals.
   */
  receivedSignal$: Observable<string | null> =
    this.receivedSignalSubject.asObservable();

  /**
   * Fetches messages for a given receiver ID.
   *
   * @param receiverId - The ID of the receiver to fetch messages for.
   * @param token - The Bearer token for authorization.
   * @returns An `Observable` emitting the response containing the list of messages.
   */
  getMessages(
    receiverId: string,
    token: string
  ): Observable<GetChatMessagesResponse> {
    const url = `${this.baseUrl}/api/Chat/messages`;
    const params = new HttpParams().set('RecevierId', receiverId);

    const headers = new HttpHeaders({
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<GetChatMessagesResponse>(url, {
        headers,
        params,
      })
      .pipe(
        tap((messages) => this.messagesSubject.next(messages['data'] ?? [])),
        catchError((error) => {
          return of({
            isSuccess: error.isSuccess ?? false,
            data: [],
          } as GetChatMessagesResponse);
        })
      );
  }

  /**
   * Starts a SignalR connection for a specified user.
   *
   * @param userId - The ID of the user initiating the connection.
   * @returns A promise that resolves when the connection is established.
   */
  async startConnection(userId: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/videocallhub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    await this.hubConnection
      .start()
      .catch((err) =>
        console.error('Error while establishing connection: ', err)
      );
  }

  /**
   * Sends a chat message to a specified receiver.
   *
   * @param senderId - The ID of the sender.
   * @param receiverId - The ID of the receiver.
   * @param message - The message content.
   * @returns A promise that resolves when the message is sent.
   */
  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<void> {
    await this.hubConnection
      .invoke('SendMessage', receiverId, message)
      .then(() =>
        this.addMessage({
          id: Date.now() + Math.floor(Math.random() * 1000),
          receiverId,
          senderId,
          message,
          timestamp: new Date().toISOString(),
        })
      )
      .catch((err) => console.error('Error while sending message: ', err));
  }

  /**
   * Listens for incoming messages via SignalR and updates the messages list.
   */
  async onReceiveMessage(): Promise<void> {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', (message) => {
        this.addMessage(message);
      });
    } else {
      console.error('SignalR connection is not established.');
    }
  }

  /**
   * Adds a new message to the local message list.
   *
   * @param message - The message content to add.
   */
  private addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);

    setTimeout(() => {
      this.scrollDown();
    }, 100);
  }

  /**
   * Automatically scrolls the chat view to the latest message.
   */
  scrollDown(): void {
    const container = document.getElementById('messages');

    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  }

  /**
   * Listens for incoming notifications via SignalR.
   */
  listenToNotifications(): void {
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log(`Notification received: ${message}`);
    });
  }

  /**
   * Sends a notification to a specific user.
   *
   * @param userId - The ID of the user to receive the notification.
   * @param message - The notification message.
   */
  sendNotification(userId: string, message: string): void {
    this.hubConnection
      .invoke('SendNotification', userId, message)
      .catch((err) => console.error('Error while sending notification: ', err));
  }

  /**
   * Sends a global notification to all connected clients.
   *
   * @param message - The notification message.
   */
  sendGlobalNotification(message: string): void {
    this.hubConnection
      .invoke('SendGlobalNotification', message)
      .catch((err) =>
        console.error('Error while sending global notification: ', err)
      );
  }

  /**
   * Sends a SignalR signal to a specific receiver.
   *
   * @param receiverId - The ID of the receiver.
   * @param signal - The signal data to send.
   * @returns A promise that resolves when the signal is sent.
   */
  async sendSignal(receiverId: string, signal: string): Promise<void> {
    await this.hubConnection
      .invoke('SendSignal', receiverId, signal)
      .catch((err) => console.error('Error sending signal: ', err));
  }

  /**
   * Listens for incoming SignalR signals.
   */
  listenForSignals(): void {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveSignal', (signal: string) => {
        this.receivedSignalSubject.next(signal);
      });
    } else {
      console.error('SignalR connection is not established.');
    }
  }
}
