'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '@/services/context/GlobalContext';
import { nanoid } from 'nanoid';

import SendIcon from '@mui/icons-material/Send';
import TextareaAutosize from 'react-textarea-autosize';
import { useMutation } from '@tanstack/react-query';
import { Message } from '@/lib/validators/message';
import { CornerDownLeft, Loader2 } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Props {
  chatId: string;
}

export default function MessageInput({ chatId }: Props) {
  const {
    messages,
    addMessages,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
    chatHistory,
    setChatHistory,
    theme,
    chatConfig,
    lastGeneratedMessage,
    setLastGeneratedMessage,
  } = useGlobalContext();
  const [messageContent, setMessageContent] = useState<string>('');
  const { data: session } = useSession();
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const megOfSpecificChat = chatHistory.filter(
    (message) => message.chatId === chatId
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const [regenerateClicked, isRegenerateClicked] = useState(false);
  const [stopClicked, isStopClicked] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageContent.trim() !== '') {
      const message: Message = {
        messageId: nanoid(),
        isUserMessage: true,
        text: messageContent,
        chatId,
      };
      sendMessage(message);
    }
  };
  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async (message: Message) => {
      setShowStopButton(true);
      setLastGeneratedMessage(message);
      abortControllerRef.current = new AbortController();

      const signal: AbortSignal = abortControllerRef.current.signal;
      const response = await fetch(`/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify({
          messages: megOfSpecificChat.concat([message]),
          chatConfig,
        }),
        signal,
      });

      console.log(response);

      if (!response.ok) {
        throw new Error();
      }
      return response.body;
    },
    onMutate(message) {
      if (!regenerateClicked || stopClicked) {
        addMessages(message);
      }
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error('No Stream Found');
      const id = nanoid();
      const responseMessage: Message = {
        messageId: id,
        isUserMessage: false,
        text: '',
        chatId,
      };
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        responseMessage,
      ]);
      addMessages(responseMessage);

      const reader = stream.getReader();

      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      // clean up
      setShowStopButton(false);
      setIsMessageUpdating(false);
      setMessageContent('');
      isRegenerateClicked(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },

    onError(_, message) {
      if (abortControllerRef?.current?.signal) {
        toast.error('Controller Aborted');
      } else {
        toast.error('Something Went Wrong, Please Try Again');
      }
      // removeMessage(message.messageId);
      textareaRef.current?.focus();
    },
  });
  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsMessageUpdating(false);
      setMessageContent('');
      isStopClicked(true);
      isRegenerateClicked(false);
      setShowStopButton(false);
    }
  };
  const handleRegenerateLastMessage = () => {
    if (lastGeneratedMessage && !isLoading) {
      isRegenerateClicked(true);
      isStopClicked(false);
      setIsMessageUpdating(true);
      setMessageContent('');
      sendMessage(lastGeneratedMessage);
    }
  };
  return (
    <>
      <div className='flex justify-end mb-5 fixed bottom-16 right-5'>
        {showStopButton && (
          <button
            onClick={handleCancelStream}
            className='bg-gray-950 text-white font-bold px-4 py-2 rounded hover:bg-blue-500 transition duration-300'>
            Stop generation
          </button>
        )}
        {megOfSpecificChat.length > 0 && (
          <button
            onClick={handleRegenerateLastMessage}
            className='bg-[#11A37f] text-white font-bold px-4 py-2 rounded hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed  '
            disabled={isLoading}>
            Regenerate
          </button>
        )}
      </div>
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}>
        <div
          className={`relative bottom-4 flex justify-center items-center gap-3 self-center box-border mt-4 w-full text-[14px] leading-3 text-white`}>
          <TextareaAutosize
            ref={textareaRef}
            disabled={isLoading}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message: Message = {
                  messageId: nanoid(),
                  isUserMessage: true,
                  text: messageContent,
                  chatId,
                };
                sendMessage(message);
              }
            }}
            maxRows={8}
            id='messageContent'
            name='messageContent'
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            autoFocus
            placeholder='Ask me anything . . .'
            className='peer disabled:opacity-50 pr-14 resize-none block w-full border border-neutral-600 rounded-md bg-zinc-100 py-1.5 text-gray-900  focus:ring-0 text-sm sm:leading-6'
          />
          <div className='absolute inset-y-0 right-20 flex py-1.5 pr-1.5'>
            <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-sm text-gray-400 '>
              {isLoading ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                <CornerDownLeft className='w-3 h-3' />
              )}
            </kbd>
          </div>
          <button
            type='submit'
            disabled={!messageContent || isLoading}
            className={`bg-[#11A37f] text-white font-bold px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-gray-300 ${
              messageContent && 'hover:opacity-50'
            }`}>
            <SendIcon />
          </button>
        </div>
      </form>
    </>
  );
}
