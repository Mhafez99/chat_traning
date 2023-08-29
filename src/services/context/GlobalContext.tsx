'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import Chat from '@/interfaces/chat.interface';
import Prompt from '@/interfaces/prompt.interface';
import { ChatTab } from '@/interfaces/chatTab.interface';
import PromptModal from '@/interfaces/promptModal.interface';
import Message from '@/interfaces/message.interface';
import { DummyUser } from '@/dummyData/dummyUser';

interface StateContext {
  user: User | undefined;
  setUser: any;
  chats: Chat[];
  setChats: any;
  prompts: Prompt[];
  setPrompts: any;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: any;
  isAuthenticationModalOpen: boolean;
  setIsAuthenticationModalOpen: any;
  isPromptModalOpen: PromptModal;
  setIsPromptModalOpen: any;
  isModalOpen: boolean;
  setIsModalOpen: any;
  chatTabs: ChatTab[];
  setChatTabs: any;
  theme: string;
  toggleTheme: any;

  messages: Message[];
  isMessageUpading: boolean;
  addMessages: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
  setIsMessageUpdating: (isUpdating: boolean) => void;
}

const initialState = {
  user: undefined,
  setUser: (user: User) => {},
  chats: [],
  setChats: (chats: Chat[]) => {},
  prompts: [],
  setPrompts: (prompts: Prompt[]) => {},
  isSettingsModalOpen: false,
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => {},
  isAuthenticationModalOpen: false,
  setIsAuthenticationModalOpen: (isAuthenticationModalOpen: boolean) => {},
  isPromptModalOpen: { conditional: false, prompt: undefined },
  setIsPromptModalOpen: (isPromptModalOpen: {}) => {},
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {},
  chatTabs: [],
  setChatTabs: (chatTabs: ChatTab[]) => {},
  theme: '',
  toggleTheme: () => {},

  messages: [],
  isMessageUpading: false,
  addMessages: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {},
};

const AppContext = createContext<StateContext>(initialState);

export const useGlobalContext = () => useContext(AppContext);

interface Props {
  children: ReactNode;
}

export default function GlobalContext({ children }: Props) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<User | undefined>(DummyUser);
  const [chats, setChats] = useState<Chat[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessageUpading, setIsMessageUpdating] = useState<boolean>(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] =
    useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState({
    conditional: false,
    prompt: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const addMessages = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.messageId != id));
  };

  const updateMessage = (
    id: string,
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.messageId === id) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      })
    );
  };

  useEffect(() => {
    if (
      isSettingsModalOpen ||
      isAuthenticationModalOpen ||
      isPromptModalOpen.conditional
    ) {
      setIsModalOpen(true);
      console.log(isAuthenticationModalOpen);
    } else {
      setIsModalOpen(false);
    }
  }, [
    isSettingsModalOpen,
    isAuthenticationModalOpen,
    isPromptModalOpen.conditional,
  ]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        prompts,
        setPrompts,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isAuthenticationModalOpen,
        setIsAuthenticationModalOpen,
        isPromptModalOpen,
        setIsPromptModalOpen,
        isModalOpen,
        setIsModalOpen,
        chatTabs,
        setChatTabs,
        theme,
        toggleTheme,
        messages,
        addMessages,
        removeMessage,
        updateMessage,
        isMessageUpading,
        setIsMessageUpdating,
        
      }}>
      {children}
    </AppContext.Provider>
  );
}
