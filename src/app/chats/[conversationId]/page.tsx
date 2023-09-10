'use client';
import { usePathname } from 'next/navigation';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Conversation from '@/components/conversation/Conversation';
import ConversationsTab from '@/components/conversationsTab/ConversationsTab';
import { useSidebarContext } from '@/services/context/SidebarContext';
import Chat from '@/interfaces/chat.interface';

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const { chats, theme, folders } = useGlobalContext();

  let chat;

  chat = chats.find((chat) => chat.chatId === params.conversationId);

  if (!chat) {
    folders.some((folder) => {
      const folderChat = folder.chats.find(
        (folderChat) => folderChat.chatId === params.conversationId
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
            <ConversationsTab chat={chat!} />
            <Conversation id={params.conversationId} />
          </>
        )}
      </div>
    </main>
  );
}
