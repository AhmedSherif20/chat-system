export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date | string;
}
