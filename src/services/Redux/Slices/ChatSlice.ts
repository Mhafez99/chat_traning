// // chatSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import Message from '@/interfaces/message.interface';

// interface ChatState {
//   [chatId: string]: Message[];
// }

// const initialState: ChatState = {};

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     setMessages: (
//       state,
//       action: PayloadAction<{ chatId: string; messages: Message[] }>
//     ) => {
//       const { chatId, messages } = action.payload;
//       state[chatId] = messages;
//     },
//   },
// });

// export const { setMessages } = chatSlice.actions;
// export default chatSlice.reducer;
