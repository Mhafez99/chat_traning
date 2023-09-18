// // chatActions.ts
// import { Dispatch } from 'redux';
// import { RootState } from './store'; // Import your root state type
// import { setMessages } from '../Slices/ChatSlice';

// interface FetchChatMessagesParams {
//   chatId: string;
//   accessToken: string;
// }

// export const fetchChatMessages =
//   ({ chatId, accessToken }: FetchChatMessagesParams) =>
//   async (dispatch: Dispatch, getState: () => RootState) => {
//     try {
//       const state = getState();
//       const cachedMessages = state.chat[chatId];

//       if (cachedMessages) {
//         dispatch(setMessages({ chatId, messages: cachedMessages }));
//       } else {
//         const response = await fetch(`/api/getChatMessages/${chatId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         if (response.status === 200) {
//           const messages = await response.json();
//           dispatch(setMessages({ chatId, messages }));
//         }
//       }
//     } catch (error) {
//       console.error('Error Fetching Chat Messages', error);
//     }
//   };
