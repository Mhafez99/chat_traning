'use client';

import Link from 'next/link';

import { useGlobalContext } from '@/services/context/GlobalContext';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Swal from 'sweetalert2';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSidebarContext } from '@/services/context/SidebarContext';
export default function ChatSidebarFooter() {
  const { user, setUser, chats, setChats, setIsSettingsModalOpen, setFolders } =
    useGlobalContext();

  const { data: session } = useSession();

  const router = useRouter();
  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const accessToken = session?.user.accessToken;
          if (!accessToken) {
            console.error('User is not authenticated.');
            return;
          }
          const response = await fetch('/api/removeAllChats', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (response.status === 200) {
            setChats([]);
            Swal.fire('Deleted!', 'Your Chats has been deleted.', 'success');
          } else {
            Swal.fire(
              'Same Error In Server',
              'Sorry Error in deleting Chats',
              'error'
            );
          }
        } catch (error) {
          console.error('Failed to delete chats ');
        }
      }
    });
  };

  const handleLogout = async () => {
    try {
      const endpoint = '/api/logout';
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: session?.user.refreshToken }),
      };

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      await signOut({
        redirect: false,
      });

      setChats([]);
      setFolders([]);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className='flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm'>
      {chats.length > 0 && (
        <>
          <button
            onClick={handleDeleteClick}
            className='flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10'>
            <DeleteForeverIcon />
            <span>Clear Chats</span>
          </button>
        </>
      )}

      <button className='flex items-center gap-3 w-full cursor-pointer select-none rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10'>
        <label
          htmlFor='fileImport'
          className='flex items-center gap-3 w-full h-full'>
          <input
            type='file'
            accept='.json'
            name='fileImport'
            id='fileImport'
            className='hidden'
          />
          <FileUploadIcon />
          <span>Import data</span>
        </label>
      </button>
      <button className='flex items-center gap-3 w-full cursor-pointer select-none rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10'>
        <Link
          href='/chats/history'
          download={<p>history</p>}
          rel='noreferrer'
          className='flex items-center gap-3 w-full h-full'>
          <FileDownloadIcon />
          <span>Export data</span>
        </Link>
      </button>
      <button
        onClick={() => setIsSettingsModalOpen(true)}
        className='flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10'>
        <SettingsIcon />
        <span>Settings</span>
      </button>
      {/* user session */}
      {session && (
        <>
          <button
            onClick={handleLogout}
            className='flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10'>
            <MeetingRoomIcon />
            <span>Logout</span>
          </button>
        </>
      )}
    </div>
  );
}
