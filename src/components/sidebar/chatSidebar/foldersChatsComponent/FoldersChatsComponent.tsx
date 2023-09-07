'use client';

import { ReactNode, useEffect, useState } from 'react';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Chat from '@/interfaces/chat.interface';
import Folder from '@/interfaces/folder.interface';

import FolderComponent from './folderComponent/FolderComponent';
import ChatComponent from './ChatComponent/ChatComponent';
import NoData from '../../components/noData/NoData';

import { useSidebarContext } from '@/services/context/SidebarContext';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function FoldersChatsComponent() {
  const { chats, setChats } = useGlobalContext();
  const { search, filteredChats, folders, setFolders } = useSidebarContext();
  const { data: session } = useSession();
  const [buttonDisabled, setIsButtonDisabled] = useState(false);

  console.log(session?.user.accessToken);

  const getChatsFolders = async () => {
    try {
      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }
      const response = await fetch('/api/getChatsAndFolders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);

      const data = await response.json();

      console.log(data);

      if (response.status === 200) {
        const chatsWithoutFolder = data.filter(
          (item: any) =>
            item.folder.folderId === 'Untitled' ||
            item.folder.title === 'Untitled'
        );
        const folders = data.filter(
          (item: any) => item.folder.folderId !== 'Untitled'
        );
        if (folders) {
          const allFoldersWithChatsAndWithoutChats: Folder[] = folders.map(
            (folder: any) => {
              return folder.folder;
            }
          );
          console.log(allFoldersWithChatsAndWithoutChats);

          setFolders(allFoldersWithChatsAndWithoutChats);
        }
        if (chatsWithoutFolder) {
          const allChat = chatsWithoutFolder[0].folder.chats;
          console.log(allChat);

          setChats(allChat);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error Fetch Data');
    }
  };
  useEffect(() => {
    getChatsFolders();
  }, [session?.user.accessToken]);

  const handleDrop = async (
    folderId: string,
    chatId: string,
    title: string
  ) => {
    try {
      setIsButtonDisabled(true);

      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }
      const response = await fetch('/api/chatToFolder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ folderUUID: folderId, chatUUID: chatId }),
      });
      console.log(response);

      const data = await response.json();

      console.log(data);
      if (response.status === 200) {
        const updatedFolders = folders.map((folder) => {
          if (folder.folderId === folderId) {
            const existingChat = folder.chats.find(
              (chat) => chat.chatId === chatId
            );
            if (!existingChat) {
              return {
                ...folder,
                chats: [...folder.chats, { title, chatId }],
              };
            }
          } else if (folder.chats.some((chat) => chat.chatId === chatId)) {
            // Remove the chat from the source folder's chatIds
            return {
              ...folder,
              chats: folder.chats.filter((chat) => chat.chatId !== chatId),
            };
          }
          return folder;
        });
        setFolders(updatedFolders);
        toast.success('Added To Folder Successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to delete chat');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const availableChats = chats.filter((chat) => {
    return !folders.some((folder) =>
      folder.chats.some((fChat) => fChat.chatId === chat.chatId)
    );
  });

  // const availableChats = chats.filter((chat) => {
  //   return folders.every((folder) => !folder.chatIds.includes(chat.chatId));
  // });

  return (
    <div className='flex-grow overflow-auto'>
      {chats.length > 0 || folders.length > 0 ? (
        <>
          {/* Folders */}
          <div className='flex border-b border-white/20 pb-2'>
            <div className='flex flex-col w-full pt-2'>
              {folders.map((folder: Folder) => (
                <div key={folder.folderId}>
                  <FolderComponent folder={folder} onDrop={handleDrop} />
                </div>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className='pt-2'>
            <div className='flex flex-col gap-1 w-full'>
              {search ? (
                <>
                  {filteredChats.length > 0 ? (
                    <>
                      {filteredChats.map((chat: Chat) => (
                        <div key={chat.chatId}>
                          <ChatComponent chat={chat} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <NoData />
                    </>
                  )}
                </>
              ) : (
                <>
                  {availableChats.map((chat: Chat) => (
                    <div key={chat.chatId}>
                      <ChatComponent chat={chat} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <NoData />
        </>
      )}
    </div>
  );
}
