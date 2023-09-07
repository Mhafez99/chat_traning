'use client';

import { useGlobalContext } from '@/services/context/GlobalContext';
import { useRef, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import SettingsModal from './settingsModal/SettingsModal';
import PromptModal from './promptModal/PromptModal';

export default function Modal() {
  const {
    isModalOpen,
    setIsModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isPromptModalOpen,
    setIsPromptModalOpen,
  } = useGlobalContext();

  const ref = useRef<HTMLDivElement>(null);

  const checkIfClickedOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsSettingsModalOpen(false);
      setIsPromptModalOpen({ conditional: false, prompt: {} });
      setIsModalOpen(false);
    }
  };

  const modalContent = (
    <div
      onClick={(event: MouseEvent<HTMLDivElement>) =>
        checkIfClickedOutside(event)
      }
      className='fixed flex justify-center items-center w-full h-full  bg-black/50 z-50'>
      {isSettingsModalOpen && (
        <>
          <div
            ref={ref}
            className='w-[512px] border border-gray-400 rounded-lg bg-[#202123] transform overflow-y-auto p-6 transition-all'>
            <SettingsModal />
          </div>
        </>
      )}
      {isPromptModalOpen.conditional && (
        <>
          <div
            ref={ref}
            className='w-[512px] border border-gray-400 rounded-lg bg-[#202123] transform overflow-y-auto p-6 transition-all'>
            <PromptModal prompt={isPromptModalOpen.prompt!} />
          </div>
        </>
      )}
    </div>
  );

  if (isModalOpen) {
    return ReactDOM.createPortal(
      modalContent!,
      document.getElementById('modal-root')!
    );
  }
}
