'use client';

import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import Chat from '@/interfaces/chat.interface';
import Folder from '@/interfaces/folder.interface';
import Prompt from '@/interfaces/prompt.interface';
import { useGlobalContext } from './GlobalContext';

interface StateContext {
  search: string;
  setSearch: any;
  filteredFolders: Folder[];
  setFilteredFolders: any;
  filteredChats: Chat[];
  setFilteredChats: any;
  filteredPrompts: Prompt[];
  setFilteredPrompts: any;
  onSearch: any;
}

const Context = createContext<StateContext>({
  search: '',
  setSearch: (search: string) => {},
  filteredFolders: [],
  setFilteredFolders: (filteredFolders: Folder[]) => {},
  filteredChats: [],
  setFilteredChats: (filteredChats: Chat[]) => {},
  filteredPrompts: [],
  setFilteredPrompts: (filteredPrompts: Prompt[]) => {},
  onSearch: () => {},
});

export const useSidebarContext = () => useContext(Context);

interface Props {
  children: ReactNode;
}

export default function SidebarContext({ children }: Props) {
  const { chats, prompts } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);


  const onSearch = (
    e: ChangeEvent<HTMLInputElement>,
    sidebar: string,
    setIsLoading: any
  ) => {
    setIsLoading(true);
    if (sidebar === 'chatSidebar') {
      setSearch((prevState) => {
        const currentState = e.target.value;
        return currentState;
      });
      setFilteredChats((prevState) => {
        const currentState = chats.filter((chat: Chat) =>
          chat.title.toLowerCase().includes(search.toLowerCase())
        );
        return currentState;
      });
    } else if (sidebar === 'promptSidebar') {
      setSearch((prevState) => {
        const currentState = e.target.value;
        return currentState;
      });
      setFilteredPrompts((prevState) => {
        const currentState = prompts.filter((prompt: Prompt) =>
          prompt.title.toLowerCase().includes(search.toLowerCase())
        );
        return currentState;
      });
    }
    setIsLoading(false);
  };

  return (
    <Context.Provider
      value={{
        search,
        setSearch,
        filteredFolders,
        setFilteredFolders,
        filteredChats,
        setFilteredChats,
        filteredPrompts,
        setFilteredPrompts,
        onSearch,
      }}>
      {children}
    </Context.Provider>
  );
}
