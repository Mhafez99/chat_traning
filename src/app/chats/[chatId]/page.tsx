'use client';
import { usePathname } from 'next/navigation';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Conversation from '@/components/conversation/Conversation';
import ConversationsTab from '@/components/conversationsTab/ConversationsTab';
import Tab from '@/components/conversation/components/tab/tab';

export default function ConversationPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chats, theme, folders } = useGlobalContext();

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
