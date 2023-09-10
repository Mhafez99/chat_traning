'use client';

import { ChangeEvent, useState } from 'react';

import { useGlobalContext } from '@/services/context/GlobalContext';

import Folder from '@/interfaces/folder.interface';

import CloseIcon from '@mui/icons-material/Close';
import { useSidebarContext } from '@/services/context/SidebarContext';

interface Props {
  sidebar: string;
}

export default function Search({ sidebar }: Props) {
  const { folders, setFolders } = useGlobalContext();
  const { search, setSearch, onSearch } = useSidebarContext();
  const [isLoading, setIsLoading] = useState(false);

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <div className='relative flex items-center'>
      <input
        className='w-full flex-1 rounded-md border border-neutral-600 bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-white'
        type='text'
        id='search'
        name='search'
        placeholder='Search...'
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onSearch(event, sidebar, setIsLoading)
        }
      />
      {search && (
        <button
          onClick={() => clearSearch()}
          className='absolute right-1 top-1 bottom-1 '>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
