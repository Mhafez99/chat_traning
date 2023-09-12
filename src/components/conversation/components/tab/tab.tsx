import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import Link from 'next/link';
import { useState } from 'react';
import Chat from '@/interfaces/chat.interface';
import Dropdown from './components/dropdown/dropdown';

type Props = { chat: Chat };

export default function Tab({ chat }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div className='flex justify-between items-center gap-3 w-full border rounded-md p-2 bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-800 dark:text-primary-200'>
      <div className='flex items-center gap-2 px-2'>
        <p>{chat?.title}</p>
        <p className='text-xs text-primary-600 dark:text-primary-100'>
          [ {chat?.modifiedAt?.toDateString()} ]
        </p>
      </div>
      <div>
        <button className='relative'>
          <TuneIcon onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
          {/* Dropdown Content */}
          {isDropdownOpen && (
            <Dropdown chat={chat} setIsDropdownOpen={setIsDropdownOpen} />
          )}
        </button>
        <Link href={'/chats'}>
          <CloseIcon />
        </Link>
      </div>
    </div>
  );
}
