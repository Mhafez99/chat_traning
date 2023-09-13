'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Chat from '@/interfaces/chat.interface';
import Folder from '@/interfaces/folder.interface';

import FolderComponent from './folderComponent/FolderComponent';
import ChatComponent from './ChatComponent/ChatComponent';
import NoData from '../../components/noData/NoData';

import { useSidebarContext } from '@/services/context/SidebarContext';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { LoaderFoldersAndChats } from '@/components/loading/LoadingMsg';
import { useRefreshToken } from '@/lib/hooks/useRefreshToken';

export default function FoldersChatsComponent() {
  const { chats, setChats, folders, setFolders } = useGlobalContext();
  const { search, filteredChats } = useSidebarContext();
  const { data: session } = useSession();
  const [buttonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingChatAndFolders, setloadingChatAndFolders] = useState(false);
  const { refreshToken, isAccessTokenExpired } = useRefreshToken();
  

  const getChatsFolders = useCallback(async () => {
    try {
      setloadingChatAndFolders(true);
      let accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }

      if (isAccessTokenExpired()) {
        await refreshToken();
        const updatedAccessToken = session?.user.accessToken;

        if (!updatedAccessToken) {
          console.error('User is not authenticated.');
          return;
        }
        accessToken = updatedAccessToken;
      }
      const response = await fetch('/api/getChatsAndFolders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const chatsWithoutFolder = data.filter(
          (item: any) => item.folder.folderId === 'Untitled'
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

          setFolders(allFoldersWithChatsAndWithoutChats);
        }
        if (chatsWithoutFolder) {
          const allChat = chatsWithoutFolder[0].folder.chats;

          setChats(allChat);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error Fetch Data');
    } finally {
      setloadingChatAndFolders(false);
    }
  },[isAccessTokenExpired, refreshToken, session?.user.accessToken])

  useEffect(() => {
    getChatsFolders();
  }, []);

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

      const data = await response.json();

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
    <div className='flex-grow overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      {loadingChatAndFolders ? (
        <LoaderFoldersAndChats />
      ) : (
        <>
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
                              <ChatComponent chat={chat} folderId='' />
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
                          <ChatComponent chat={chat} folderId='Untitled' />
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
        </>
      )}
    </div>
  );
}
