'use client';
import { usePathname } from 'next/navigation';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Conversation from '@/components/conversation/Conversation';
import ConversationsTab from '@/components/conversationsTab/ConversationsTab';
import Tab from '@/components/conversation/components/tab/tab';
import { useSession } from 'next-auth/react';
import { useRefreshToken } from '@/lib/hooks/useRefreshToken';
import { useCallback, useEffect, useState } from 'react';
import Message from '@/interfaces/message.interface';

export default function ConversationPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chats, theme, folders, setMessages } = useGlobalContext();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { data: session } = useSession();
  const { refreshToken, isAccessTokenExpired } = useRefreshToken();

  const getChatMessages = async () => {
    try {
      setLoadingMessages(true);
      setMessages([]);
      let accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }
      if (isAccessTokenExpired()) {
        await refreshToken();
      }
      const response = await fetch(`/api/getChatMessages/${params.chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        const messages = await response.json();
        setMessages(messages);
      }
    } catch (error) {
      console.error('Error Fetch Data', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    getChatMessages();
  }, []);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: [`${params.chatId}`],
  //   queryFn: getChatMessages,
  // });

  // useEffect(() => {
  //   if (data === undefined) {
  //     setMessages([]);
  //   } else {
  //     setMessages(data);
  //   }
  // }, [data]);

  let chat;

  chat = chats.find((chat) => chat.chatId === params.chatId);

  if (!chat) {
    folders.some((folder) => {
      const folderChat = folder.chats.find(
        (folderChat) => folderChat.chatId === params.chatId
      );
      if (folderChat) {
        chat = folderChat;
        return true;
      }
      return false;
    });
  }

  return (
    <main className='flex flex-1'>
      <div
        className={`relative flex flex-col flex-1 overflow-hidden ${
          theme === 'dark' ? ' bg-[#343541]' : 'bg-white'
        }`}>
        {chat && (
          <>
            {/* <ConversationsTab chat={chat!} /> */}
            <Tab chat={chat} />
            <Conversation
              id={params.chatId}
              loadingMessages={loadingMessages}
            />
          </>
        )}
      </div>
    </main>
  );
}
