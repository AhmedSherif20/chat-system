import { inject, Injectable } from '@angular/core';
import { Vars } from '../../../../enums/vars';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GetChatMessagesResponse } from '../../interfaces/GetChatMessagesReponse';
import { Message } from '../../interfaces/Message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = Vars.baseUrl;
  private hubConnection: signalR.HubConnection =
    new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/videocallhub`)
      .build();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  /**
   * Fetches messages for a given receiver ID.
   * @param receiverId The ID of the receiver.
   * @param token The Bearer token for authorization.
   * @returns An Observable containing the list of messages.
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

  async startConnection(userId: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/videocallhub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    await this.hubConnection
      .start()
      .then(() => console.log('connection established'))
      .catch((err) =>
        console.error('Error while establishing connection: ', err)
      );
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<void> {
    console.log('Sending to:', receiverId, 'Message:', message);
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

  async sendNotification(userId: string, message: string): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection
        .invoke('SendNotification', userId, message)
        .then((res) => console.log(res))
        .catch((err) =>
          console.error('Error while sending notification: ', err)
        );
    } else {
      console.log('no hub connection');
    }
  }

  async onReceiveMessage(): Promise<void> {
    console.log('onReceiveMessage');

    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', (message) => {
        console.log('onReceiveMessage onhub');
        console.log(message);

        this.addMessage(message);
      });
    } else {
      console.log('no hub connection');
    }
  }

  /**
   * Adds a new message to the local messages list.
   * @param message The message content.
   */
  private addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);

    setTimeout(() => {
      this.scrollDown();
    }, 100);
  }

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
}
