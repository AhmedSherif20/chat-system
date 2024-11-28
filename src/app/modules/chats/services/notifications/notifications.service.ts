import { Injectable } from '@angular/core';
import { Vars } from '../../../../enums/vars';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private baseUrl = Vars.baseUrl;
  private hubConnection: signalR.HubConnection =
    new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/videocallhub`)
      .build();

  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/videocallhub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('connection established'))
      .catch((err) =>
        console.error('Error while establishing connection: ', err)
      );
  }

  listenToNotifications(): void {
    console.log(`ReceiveNotification working! outside hub`);

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log(`ReceiveNotification working!`);

      console.log(message);
    });
  }

  sendNotification(userId: string, message: string): void {
    this.hubConnection
      .invoke('SendNotification', userId, message)
      .then((res) => console.log(res))
      .catch((err) => console.error('Error while sending notification: ', err));
  }

  sendGlobalNotification(message: string): void {
    this.hubConnection
      .invoke('SendGlobalNotification', message)
      .catch((err) =>
        console.error('Error while sending global notification: ', err)
      );
  }
}
