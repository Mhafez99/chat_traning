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
  const { user, chats, setChats } = useGlobalContext();
  const { folders, setFolders } = useSidebarContext();
  const { data: session } = useSession();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAddChat = async () => {
    try {
      setIsButtonDisabled(true);
      let counter = chats.length + 1;
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
        body: JSON.stringify({ title: `New Conversation ${counter}` }),
      });
      console.log(response);

      const data = await response.json();

      console.log(data);
      if (response.status === 200) {
        toast.success('Chat is Created Successfully');
        setChats((prevChats: Chat[]) => [
          ...prevChats,
          {
            title: `New Conversation ${counter}`,
            chatId: data.chatId,
            modifiedAt: new Date(),
            createdAt: new Date(),
            isDeleted: false,
          },
        ]);
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
      let counter = folders.length + 1;
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
        body: JSON.stringify({ title: `New Folder ${counter}` }),
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
            title: `New Folder ${counter}`,
            isDeleted: false,
            createdAt: new Date(),
            chatIds: [],
            backgroundColor: '',
          },
        ]);
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
          <button
            onClick={handleAddChat}
            disabled={
              isButtonDisabled || session?.user.accessToken === 'undefined'
            }
            className='flex flex-shrink-0 items-center gap-3 w-[190px] rounded-md border border-white/20 bg-transparent p-3 cursor-pointer select-none text-white transition-colors duration-200 hover:bg-gray-500/10 disabled:bg-gray-600 disabled:cursor-not-allowed'>
            <AddIcon />
            New Chat
          </button>
          <button
            onClick={hadleAddFolder}
            disabled={
              isButtonDisabled || session?.user.accessToken === 'undefined'
            }
            className='flex flex-shrink-0 items-center gap-3 ml-2 rounded-md border border-white/20 bg-transparent p-3 cursor-pointer text-sm text-white transition-colors duration-200 hover:bg-gray-500/10 disabled:bg-gray-600 disabled:cursor-not-allowed'>
            <CreateNewFolderIcon />
          </button>
        </>
      )}

      <Toaster position='top-center' />
    </div>
  );
}
