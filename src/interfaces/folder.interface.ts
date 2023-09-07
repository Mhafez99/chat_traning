export default interface Folder {
  title: string;
  folderId: string;
  chats: {
    title: string;
    chatId: string;
  }[];
  createdAt?: Date;
  isDeleted?: boolean;
  backgroundColor?: string;
  userId?: string;
  type?: string;
}
