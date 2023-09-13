import {
  ChatGPTMessage,
  OpenAiStream,
  OpenAiStreamPayload,
} from '@/lib/openai-stream';
import { MessageArraySchema } from '@/lib/validators/message';

export async function POST(req: Request) {
  const { messages, chatConfig } = await req.json();

  const parsedMessages = MessageArraySchema.parse(messages);

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    return {
      role: message.isUserMessage ? 'user' : 'system',
      content: message.text,
    };
  });

  const payload: OpenAiStreamPayload = {
    model: chatConfig.model || 'gpt-3.5-turbo',
    temperature: chatConfig.temperature || 0.4,
    top_p: chatConfig.topP || 1,
    n: chatConfig.n || 1,
    presence_penalty: chatConfig.presencePenalty || 0,
    frequency_penalty: chatConfig.frequencyPenalty || 0,
    max_tokens: chatConfig.maxTokens || 150,
    messages: outboundMessages,
    stream: true,
  };

  const stream = await OpenAiStream(payload);

  return new Response(stream);
}

// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { method } = req;
//     if (method === 'POST') {
//       const { messages } = await req.json();
//       const token = req.headers.get('authorization') as string;
//       const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/ask/${
//         messages[messages.length - 1].chatId
//       }`;
//       const options = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//         body: JSON.stringify({ question: messages[messages.length - 1].text }),
//       };
//       const response = await fetch(endpoint, options);

//       console.log(response);

//       if (response.status !== 201) {
//         return NextResponse.json(response.text, { status: response.status });
//       }
//       return new NextResponse(response.body, { status: 201 });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
