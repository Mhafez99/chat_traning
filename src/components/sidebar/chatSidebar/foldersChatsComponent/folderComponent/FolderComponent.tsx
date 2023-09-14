'use client';

import { useEffect, useRef, useState } from 'react';

import Folder from '@/interfaces/folder.interface';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useGlobalContext } from '@/services/context/GlobalContext';
import ChatComponent from '../ChatComponent/ChatComponent';
import { BlockPicker } from 'react-color';

import { IconCaretDown, IconCaretRight } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  LoaderDelete,
  LoaderDragAndDrop,
  LoaderRenameTitle,
} from '@/components/loading/LoadingMsg';

interface Props {
  folder: Folder;
  onDrop: (folderId: string, chatId: string, title: string) => void;
}
type ColorObject = {
  hex: string;
};
export default function FolderComponent({ folder, onDrop }: Props) {
  const { chats, setChats, folders, setFolders } = useGlobalContext();
  const [title, setTitle] = useState(folder.title);
  const [editTitle, setEditTitle] = useState(false);
  const [deleteFolderConfirm, setDeleteFolderConfirm] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(folder.backgroundColor);
  const colorPickerRef = useRef(null);
  const [textColorClass, setTextColorClass] = useState('white');
  const [buttonDisabled, setIsButtonDisabled] = useState(false);
  const [isDropStart, setIsDropStart] = useState(false);
  const { data: session } = useSession();

  const [isRenameFolder, setIsRenameFolder] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editTitle) {
      inputRef?.current?.select();
    }
  }, [editTitle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showColorPicker &&
        colorPickerRef.current &&
        !(colorPickerRef.current as unknown as HTMLElement).contains(
          event.target as Node
        )
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColorPicker]);
  useEffect(() => {
    if (folder && folder.backgroundColor) {
      const brightness = getBrightness(folder.backgroundColor);
      const newTextColorClass = brightness < 128 ? 'white' : 'black';
      setTextColorClass(newTextColorClass);
    }
  }, [folder]);

  function handleChange(e: any) {
    setTitle(e.target.value);
  }

  const handleEditFolderName = async (e: any, folderId: string) => {
    if (title.trim() === '') {
      toast.error('Folder name cannot be empty');
      return;
    }
    if (title === folder.title) {
      toast.error('Folder name same the old name');
      return;
    }
    const accessToken = session?.user.accessToken;
    if (!accessToken) {
      console.error('User is not authenticated.');
      return;
    }
    try {
      setIsRenameFolder(true);
      const response = await fetch('/api/renameFolderName', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, folderId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message);
        setFolders(
          folders.map((folder: Folder) => {
            if (folder.folderId === folderId) {
              folder.title = title;
              return folder;
            }
            return folder;
          })
        );
        setEditTitle(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to Edit Name of this Folder ');
    } finally {
      setIsRenameFolder(false);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      setIsButtonDisabled(true);

      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }
      const response = await fetch('/api/removeFolder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ folderUUID: id }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const updatedFolders = folders.filter(
          (folder: Folder) => folder.folderId !== id
        );
        setFolders(updatedFolders);
        // Remove all chats inside the deleted folder
        const deletedFolder = folders.find((folder) => folder.folderId === id);
        if (deletedFolder) {
          const chatsToRemove = deletedFolder.chats.map((chat) => chat.chatId);
          const updatedChats = chats.filter(
            (chat) => !chatsToRemove.includes(chat.chatId)
          );
          setChats(updatedChats);
        }
        toast.success('Folder is Deleted Successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to delete chat ');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropStart(true);
    const dataString = event.dataTransfer.getData('application/json');
    const data = JSON.parse(dataString);
    const { title, chatId } = data;
    const sourceFolderId = event.dataTransfer.getData('sourceFolderId');

    const chatExistsInFolder = folder.chats.some(
      (chat) => chat.chatId === chatId
    );

    if (!chatExistsInFolder) {
      console.log(
        'Dropped chat with ID:',
        chatId,
        'into folder with ID:',
        folder.folderId
      );
      onDrop(folder.folderId, chatId, title);
    }
    setIsDropStart(false);
  };

  function toggleChatList() {
    setIsChatListOpen((prev) => !prev);
  }

  const handleBackgroundColorChange = (color: ColorObject) => {
    setCurrentColor(color.hex);
    const updatedFolders = folders.map((f) =>
      f.folderId === folder.folderId ? { ...f, backgroundColor: color.hex } : f
    );
    setFolders(updatedFolders);
  };

  function getBrightness(hexColor: string) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  return (
    <>
      <div
        className='relative flex items-center'
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        {editTitle ? (
          <>
            <button
              className='flex w-full cursor-pointer  items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 border border-gray-500'
              style={{
                backgroundColor: folder.backgroundColor,
              }}>
              <IconCaretRight size={18} color={textColorClass} />
              <input
                disabled= {isRenameFolder}
                ref={inputRef}
                type='text'
                id='title'
                name='title'
                value={title}
                onChange={() => handleChange(event)}
                autoFocus
                className={`mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-${textColorClass} outline-none `}
              />
            </button>

            <div className='absolute right-1 z-10 flex text-gray-300'>
              {isRenameFolder ? (
                <LoaderRenameTitle />
              ) : (
                <>
                  <button
                    onClick={() => handleEditFolderName(event, folder.folderId)}
                    type='submit'
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <CheckIcon />
                  </button>
                  <button
                    onClick={() => setEditTitle(!editTitle)}
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
                <button
                  className='flex w-full cursor-pointer my-2 items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 border border-gray-500'
                  onClick={toggleChatList}
                  style={{
                    backgroundColor: folder.backgroundColor,
                  }}>
                  {isChatListOpen ? (
                    <IconCaretDown size={18} color={textColorClass} />
                  ) : (
                    <IconCaretRight size={18} color={textColorClass} />
                  )}

                  <div
                    className={`relative max-h-5 flex-1 overflow-hidden text-red whitespace-nowrap break-all text-left text-[12.5px] leading-2 text-${textColorClass}`}>
                    {folder.title}
                  </div>
                </button>
              </>
            )}

            {deleteFolderConfirm && !buttonDisabled ? (
              <>
                <div className='absolute right-1 z-10 flex text-gray-300'>
                  <button
                    onClick={() => handleDeleteFolder(folder.folderId)}
                    className='min-w-[20px] p-1 text-red-600 '>
                    <CheckIcon />
                  </button>
                  <button
                    onClick={() => setDeleteFolderConfirm(!deleteFolderConfirm)}
                    className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                    <ClearIcon />
                  </button>
                </div>
              </>
            ) : (
              <>
                {!buttonDisabled && (
                  <>
                    <div className='absolute right-1  flex text-gray-300'>
                      <div>
                        <div className='relative'>
                          <button
                            className={`bg-${textColorClass} font-bold p-3 rounded-full transition`}
                            onClick={() =>
                              setShowColorPicker(!showColorPicker)
                            }></button>
                        </div>
                        {showColorPicker && (
                          <div
                            className='absolute -right-1 top-9 z-50'
                            ref={colorPickerRef}>
                            <BlockPicker
                              onChange={handleBackgroundColorChange}
                              color={currentColor}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setEditTitle(!editTitle)}
                        className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                        <EditIcon />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteFolderConfirm(!deleteFolderConfirm)
                        }
                        className='min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100'>
                        <DeleteIcon />
                      </button>
                      {isDropStart && <LoaderDragAndDrop />}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      {isChatListOpen && (
        <ul className='pl-3 border-l border-gray-300 mt-2'>
          {folder.chats.map((chat) => {
            // const chat = chats.find((c) => c.chatId === chatId);
            return (
              <li key={chat.chatId} className='mb-1 text-center'>
                {chat && (
                  <ChatComponent chat={chat} folderId={folder.folderId} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
