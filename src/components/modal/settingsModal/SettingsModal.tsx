import { useGlobalContext } from '@/services/context/GlobalContext';
import { useSidebarContext } from '@/services/context/SidebarContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import General from './components/general/general';
import Config from './components/chat-config/chatConfig';

export default function SettingsModal() {
  const { isSettingsModalOpen, setIsSettingsModalOpen, theme, toggleTheme } =
    useGlobalContext();
  const searchParams = useSearchParams();
  const settings: string = searchParams.get('settings') as string;

  return (
    <div className='flex flex-col md:flex-row w-full h-screen md:w-[620px] md:max-h-[620px] rounded-md overflow-y-auto bg-gray-700 text-gray-200'>
      <div className='self-stretch w-full md:w-52 bg-primary-50 text-primary-700 dark:bg-primary-700 dark:text-primary-200'>
        <ul className='flex md:flex-col justify-start items-center h-full'>
          <li
            className={`w-full h-full md:h-fit p-2 text-center cursor-pointer hover:bg-primary-300 dark:hover:bg-primary-800 ${
              settings === 'general' && 'bg-primary-300 dark:bg-primary-800'
            }`}>
            <Link
              className='flex items-center justify-center h-full'
              href={{ query: { settings: 'general' } }}>
              General
            </Link>
          </li>
          <li
            className={`w-full h-full md:h-fit p-2 text-center cursor-pointer hover:bg-primary-300 dark:hover:bg-primary-800 ${
              settings === 'chatConfig' && 'bg-primary-300 dark:bg-primary-800'
            }`}>
            <Link
              className='flex items-center justify-center h-full'
              href={{ query: { settings: 'chatConfig' } }}>
              Chat Config
            </Link>
          </li>
          <li
            className={`w-full p-2 text-center cursor-pointer  hover:bg-primary-300 dark:hover:bg-primary-800 ${
              settings === 'terms&conditions' &&
              'bg-primary-300 dark:bg-primary-800'
            }`}>
            <Link
              className='flex items-center justify-center h-full'
              href={{ query: { settings: 'terms&conditions' } }}>
              Privacy Terms & Conditions
            </Link>
          </li>
        </ul>
      </div>

      <div className='flex-1 flex flex-col justify-between  py-6 px-4 md:px-8'>
        <div className='flex flex-col overflow-y-auto py-2'>
          <p className='pb-4 text-center text-xl font-bold'>Settings</p>
          {settings === 'general' && <General />}
          {settings === 'chatConfig' && <Config />}
          {/* {settings === "terms&conditions" && <TermsAndConditions />} */}
        </div>
      </div>
    </div>
  );
}
