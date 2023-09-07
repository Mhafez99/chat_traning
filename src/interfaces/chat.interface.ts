export default interface Chat {
  chatId: string;
  title: string;
  userId?: string;
  folderId?: string;
  modifiedAt?: Date;
  createdAt?: Date;
  isDeleted?: boolean;
}
