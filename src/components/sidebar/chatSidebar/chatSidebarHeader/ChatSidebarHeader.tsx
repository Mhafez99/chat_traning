import { useGlobalContext } from '@/services/context/GlobalContext';

import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useSidebarContext } from '@/services/context/SidebarContext';
import { useSession } from 'next-auth/react';
import Chat from '@/interfaces/chat.interface';
import Folder from '@/interfaces/folder.interface';
import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';

import { Loader } from '@/components/loading/LoadingMsg';

export default function ChatSidebarHeader() {
  const { user, chats, setChats, folders, setFolders } = useGlobalContext();
  const [title, setTitle] = useState(''); // New chat title state

  const { data: session } = useSession();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAddChat = async () => {
    try {
      setIsButtonDisabled(true);
      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        toast.success('Chat is Created Successfully');
        setChats((prevChats: Chat[]) => [
          ...prevChats,
          {
            title,
            chatId: data.chatId,
            createdAt: data.createdAt,
          },
        ]);
        setTitle('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to save chat title');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const hadleAddFolder = async () => {
    try {
      setIsButtonDisabled(true);
      const accessToken = session?.user.accessToken;
      if (!accessToken) {
        console.error('User is not authenticated.');
        return;
      }

      const response = await fetch('/api/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title }),
      });
      console.log(response);

      const data = await response.json();

      console.log(data);
      if (response.status === 200) {
        toast.success('Folder is Created Successfully');

        setFolders((prevFolder: Folder[]) => [
          ...prevFolder,
          {
            folderId: data.folderID,
            title,
            chats: [],
            backgroundColor: '',
          },
        ]);
        setTitle('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to save chat title');
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className='flex items-center'>
      {isButtonDisabled ? (
        <Loader />
      ) : (
        <>
          <div className='flex flex-col'>
            <input
              type='text'
              placeholder='Enter Title For Chat Or Folder'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full flex-1 rounded-md border border-neutral-600 bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-white'
            />
            <div className='flex mt-3'>
              <button
                onClick={handleAddChat}
                disabled={
                  isButtonDisabled ||
                  session?.user.accessToken === 'undefined' ||
                  title === ''
                }
                className='flex flex-shrink-0 items-center gap-3 w-[190px] rounded-md border border-white/20 bg-transparent p-3 cursor-pointer select-none text-white transition-colors duration-200 hover:bg-gray-500/10 disabled:bg-gray-600 disabled:cursor-not-allowed'>
                <AddIcon />
                New Chat
              </button>
              <button
                onClick={hadleAddFolder}
                disabled={
                  isButtonDisabled ||
                  session?.user.accessToken === 'undefined' ||
                  title === ''
                }
                className='flex flex-shrink-0 items-center gap-3 ml-2 rounded-md border border-white/20 bg-transparent p-3 cursor-pointer text-sm text-white transition-colors duration-200 hover:bg-gray-500/10 disabled:bg-gray-600 disabled:cursor-not-allowed'>
                <CreateNewFolderIcon />
              </button>
            </div>
          </div>
        </>
      )}

      <Toaster position='top-center' />
    </div>
  );
}
