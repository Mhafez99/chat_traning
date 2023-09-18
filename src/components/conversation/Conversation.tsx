import Link from 'next/link';
import { useGlobalContext } from '@/services/context/GlobalContext';
import Chat from '@/interfaces/chat.interface';

import MessageInput from './components/input/Input';
import Messages from './components/messages/Messages';
import { Suspense } from 'react';

interface Props {
  id: string;
  loadingMessages: boolean;
}

export default function Conversation({ id, loadingMessages }: Props) {
  const { chats, theme, folders } = useGlobalContext();

  let chat;

  chat = chats.find((chat: Chat) => chat.chatId.includes(id));

  if (!chat) {
    folders.some((folder) => {
      const folderChat = folder.chats.find(
        (folderChat) => folderChat.chatId === id
      );
      if (folderChat) {
        chat = folderChat;
        return true;
      }
      return false;
    });
  }

  return (
    <>
      {chat ? (
        <>
          <div
            className={`relative flex flex-col flex-1 w-full border-t border-t-neutral-800 bg-[#343541] p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${
              theme === 'dark' ? 'bg-[#343541]' : 'bg-white'
            }`}>
            {/* Messages */}

            <Messages loadingMessages={loadingMessages} />

            {/* Input Message */}
            <MessageInput chatId={id} />
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col justify-center items-center flex-1 '>
            <p className='text-2xl font-bold text-white'>
              This Conversation does not exist.
            </p>
            <Link
              href={'/'}
              className='text-xl font-bold text-sky-700 underline '>
              Home
            </Link>
          </div>
        </>
      )}
    </>
  );
}
