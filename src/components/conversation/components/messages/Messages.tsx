import Message from '@/interfaces/message.interface';

import SingleMessage from './message/Message';
import { FC, HTMLAttributes } from 'react';
import { useGlobalContext } from '@/services/context/GlobalContext';
import ReactMarkdown from 'react-markdown';
import TableComponent from './message/TableComponent';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-hot-toast';
import UserAvatar from '@/components/avatars/UserAvatar';
import BotAvatar from '@/components/avatars/BotAvatar';

interface Props {
  chatId: string;
}
export default function Messages({ chatId }: Props) {
  const { messages } = useGlobalContext();
  const inverseMessages = [...messages].reverse();
  const chatMessages = inverseMessages.filter(
    (message) => message.chatId === chatId
  );

  const renderMessageContent = (message: Message) => {
    const isCodeMessage =
      message.isUserMessage === false && isCode(message.text);
    const isTableMessage =
      message.isUserMessage === false && isTable(message.text);

    if (isCodeMessage) {
      return (
        <ReactMarkdown
          components={{
            pre: ({ node, ...props }) => (
              <div className='overflow-auto w-full my-2  p-2 rounded-lg'>
                <pre {...props} />
              </div>
            ),
            code: ({ node, inline, className, children, ...codeProps }) => {
              const language = className?.replace('language-', '');
              if (inline) {
                return (
                  <code className='bg-black/10 rounded-lg p-1' {...codeProps}>
                    {children}
                  </code>
                );
              } else {
                return (
                  <div className='mb-2'>
                    <div className='flex justify-between items-end'>
                      <div className='text-sm text-gray-500  rounded-md p-1 uppercase font-bold'>
                        {language}
                      </div>
                      <button
                        className='bg-blue-500 hover:bg-blue-700 text-white text-sm px-2 py-1 rounded-md mt-2'
                        onClick={() => {
                          navigator.clipboard.writeText(children as string);
                          toast.success('Copied');
                        }}>
                        Copy Code
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      style={solarizedlight}
                      customStyle={{
                        backgroundColor: 'black',
                      }}>
                      {children as string}
                    </SyntaxHighlighter>
                  </div>
                );
              }
            },
          }}>
          {message.text}
        </ReactMarkdown>
      );
    } else if (isTableMessage) {
      return <TableComponent tableText={message.text} />;
    } else {
      return <SingleMessage message={message} />;
    }
  };
  const isCode = (text: string) => {
    return text.trim().includes('```');
  };
  const isTable = (text: string) => {
    return text.trim().includes('|');
  };

  return (
    <div className='flex flex-col-reverse flex-1 px-2 py-3 mb-12'>
      <div className='flex-1 flex-grow' />
      {chatMessages?.map((message) => {
        if (message)
          return (
            <div
              key={message?.messageId}
              className={`px-4 py-2 rounded-lg my-2 ${
                message.isUserMessage ? 'bg-[#434654]' : 'bg-white'
              }`}>
              <div
                className={`flex items-end ${
                  message.isUserMessage && 'justify-end'
                }`}>
                <div
                  className={`flex space-y-2 text-sm max-w-2xl mx-2 overflow-x-hidden${
                    message.isUserMessage
                      ? 'order-1 items-end'
                      : 'order-2 items-start'
                  }`}>
                    {/* {message.isUserMessage ? <UserAvatar /> : <BotAvatar />} */}
                  <p
                    className={` ${
                      message.isUserMessage ? 'text-white' : 'text-gray-900'
                    }`}>
                    {renderMessageContent(message)}
                  </p>
                </div>
              </div>
            </div>
          );
      })}
    </div>
  );
}
