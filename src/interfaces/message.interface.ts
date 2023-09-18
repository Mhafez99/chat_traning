export default interface Message {
  isUserMessage: boolean;
  text: string;
  messageId?: string;
  chatId?: string;
  userId?: string;
  answer?: string;
  createdAt?: Date;
  isDeleted?: boolean;
}
