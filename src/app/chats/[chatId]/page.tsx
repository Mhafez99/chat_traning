'use client';
import { usePathname } from 'next/navigation';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Conversation from '@/components/conversation/Conversation';
import ConversationsTab from '@/components/conversationsTab/ConversationsTab';
import Tab from '@/components/conversation/components/tab/tab';
import { useSession } from 'next-auth/react';
import { useRefreshToken } from '@/lib/hooks/useRefreshToken';
import { useEffect, useState } from 'react';

export default function ConversationPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chats, theme, folders, addMessages } = useGlobalContext();
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { data: session } = useSession();
  const { refreshToken, isAccessTokenExpired } = useRefreshToken();

  const getChatMessages = async () => {
    try {
      setLoadingMessages(true);
      let accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }

      // if (isAccessTokenExpired()) {
      //   await refreshToken();
      // }
      const response = await fetch(`/api/getChatMessages/${params.chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        const messages = await response.json();
        const message = messages.map((message: any) => {
          console.log(message);
          // addMessages(message);
        });
      }
    } catch {}
  };

  useEffect(() => {
    getChatMessages();
  }, []);

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
            <Conversation id={params.chatId} />
          </>
        )}
      </div>
    </main>
  );
}
