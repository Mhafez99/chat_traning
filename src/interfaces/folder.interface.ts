
export default interface Folder {
  folderId: string;
  title: string;
  createdAt: Date;
  isDeleted: boolean;
  chatIds: string[];
  backgroundColor: string;
  userId?: string;
  type?: string;
}
