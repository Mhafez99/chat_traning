export default interface Message {
  messageId: string;
  text: string;
  isUserMessage: boolean;
  chatId: string;
  userId?: string;
  answer?: string;
  createdAt?: Date;
  isDeleted?: boolean;
}
