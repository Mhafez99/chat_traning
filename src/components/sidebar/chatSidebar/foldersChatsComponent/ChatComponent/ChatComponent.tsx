'use client';

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Chat from '@/interfaces/chat.interface';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ChatIcon from '@mui/icons-material/Chat';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  LoaderDelete,
  LoaderDragAndDrop,
  LoaderRenameTitle,
} from '@/components/loading/LoadingMsg';
import { ChatTab } from '@/interfaces/chatTab.interface';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  chat: Chat;
  folderId: string;
}

export default function ChatComponent({ chat, folderId }: Props) {
  const { chats, setChats, folders, setFolders, setChatTabs, chatTabs } =
    useGlobalContext();

  const [buttonDisabled, setIsButtonDisabled] = useState(false);

  const [isRenameChat, setIsRenameChat] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState(chat.title);
  const [deleteChatConfirm, setDeleteChatConfirm] = useState(false);
  const [openEditTitle, setOpenEditTitle] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (openEditTitle) {
      inputRef?.current?.select();
    }
  }, [openEditTitle]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  const handleEditChatName = async (folderId: string, chatId: string) => {
    if (title.trim() === '') {
      toast.error('Chat name cannot be empty');
      return;
    }
    if (title === chat.title) {
      toast.error('Chat name same the old name');
      return;
    }
    const accessToken = session?.user.accessToken;
    if (!accessToken) {
      console.error('User is not authenticated.');
      return;
    }
    try {
      setIsRenameChat(true);
      const response = await fetch('/api/renameChatName', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, chatId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message);
        if (folderId === 'Untitled') {
          setChats(
            chats.map((chat: Chat) => {
              if (chat.chatId === chatId) {
                chat.title = title;
                return chat;
              }
              return chat;
            })
          );
        } else {
          const updatedFolders = folders.map((folder) => {
            if (folder.folderId === folderId) {
              const updatedChats = folder.chats.map((chat) => {
                if (chat.chatId === chatId) {
                  return { ...chat, title };
                }
                return chat;
              });
              return { ...folder, chats: updatedChats };
            }
            return folder;
          });
          setFolders(updatedFolders);
        }
        setOpenEditTitle(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to Edit Name of this  chat ');
    } finally {
      setIsRenameChat(false);
    }
  };

  const handleDeleteChat = async (id: string) => {
    try {
      setIsButtonDisabled(true);

      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }
      const response = await fetch('/api/removeChat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ chatUUID: id }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setChats(chats.filter((chat: Chat) => chat.chatId !== id));
        setChatTabs(chatTabs.filter((chatTab: ChatTab) => chatTab.id !== id));
        const updatedFolders = folders.map((folder) => ({
          ...folder,
          chats: folder.chats.filter((chat) => chat.chatId !== id),
        }));
        setFolders(updatedFolders);
        if (params.chatId === id) {
          router.push('/chats');
        }
        toast.success('Chat is Deleted Successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to delete chat ');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setIsLoading(true);
    const data = {
      title: chat.title,
      chatId: chat.chatId,
    };
    event.dataTransfer.setData('application/json', JSON.stringify(data));
  };

  const handleDragEnd = () => {
    setIsLoading(false);
  };

  return (
    <>
      <div
        className='relative flex items-center'
        draggable
        onDragStart={handleDragStart}
        onDragOver={(event) => event.preventDefault()}
        onDragEnd={handleDragEnd}>
        {openEditTitle ? (
          <>
            <button
              className='flex items-center gap-3 w-full rounded-lg bg-[#343541]/90 p-3 cursor-pointer text-sm transition-colors duration-200 hover:bg-[#343541]/90 disabled:select-none'
              draggable='true'>
              <ChatIcon />
              <input
                disabled={isRenameChat}
                ref={inputRef}
                type='text'
                id='title'
                name='title'
                value={title}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChange(event)
                }
                autoFocus
                required
                className='mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100'
              />
            </button>

            <div className='absolute right-1 z-10 flex text-gray-300'>
              {isRenameChat ? (
                <LoaderRenameTitle />
              ) : (
                <>
                  <button
                    onClick={(event: MouseEvent<HTMLButtonElement>) =>
                      handleEditChatName(folderId, chat.chatId)
                    }
                    type='submit'
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <CheckIcon />
                  </button>
                  <button
                    onClick={() => setOpenEditTitle(!openEditTitle)}
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <ClearIcon />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {buttonDisabled ? (
              <LoaderDelete />
            ) : (
              <>
                <Link
                  href={`/chats/${chat.chatId}`}
                  className='flex items-center gap-3 w-full rounded-lg bg-[#343541]/90 p-3 cursor-pointer text-sm transition-colors duration-200 hover:bg-[#343541]/90'>
                  <ChatIcon />
                  <div className='relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 pr-12 first-letter:uppercase'>
                    {chat.title}
                  </div>
                </Link>
              </>
            )}

            {deleteChatConfirm && !buttonDisabled ? (
              <>
                <div className='absolute right-1 z-10 flex text-gray-300'>
                  <button
                    disabled={buttonDisabled}
                    onClick={() => handleDeleteChat(chat.chatId)}
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <CheckIcon />
                  </button>
                  <button
                    disabled={buttonDisabled}
                    onClick={() => setDeleteChatConfirm(!deleteChatConfirm)}
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <ClearIcon />
                  </button>
                </div>
              </>
            ) : (
              <>
                {!buttonDisabled && (
                  <>
                    <div className='absolute right-1 z-10 flex text-gray-300'>
                      <button
                        onClick={() => setOpenEditTitle(!openEditTitle)}
                        className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setDeleteChatConfirm(!deleteChatConfirm)}
                        className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                        <DeleteIcon />
                      </button>
                      {isLoading && <LoaderDragAndDrop />}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
