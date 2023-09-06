'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '@/services/context/GlobalContext';
import Chat from '@/interfaces/chat.interface';

import MessageInput from './components/input/Input';
import Messages from './components/messages/Messages';

interface Props {
  id: string;
}

export default function Conversation({ id }: Props) {
  const { chats, theme } = useGlobalContext();

  return (
    <>
      {chats.find((chat: Chat) => chat.chatId.includes(id)) ? (
        <>
          <div
            className={`relative flex flex-col flex-1 w-full border-t border-t-neutral-800 bg-[#343541] p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${
              theme === 'dark' ? 'bg-[#343541]' : 'bg-white'
            }`}>
            {/* Messages */}
            <Messages chatId={id} />

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
