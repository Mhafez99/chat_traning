export default interface Chat {
  chatId: string;
  userId?: string;
  folderId?: string;
  title: string;
  modifiedAt: Date;
  createdAt: Date;
  isDeleted: boolean;
}
