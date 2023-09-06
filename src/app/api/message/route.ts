import {
  ChatGPTMessage,
  OpenAiStream,
  OpenAiStreamPayload,
} from '@/lib/openai-stream';
import { MessageArraySchema } from '@/lib/validators/message';

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages);

  const parsedMessages = MessageArraySchema.parse(messages);

  console.log(parsedMessages);

  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    return {
      role: message.isUserMessage ? 'user' : 'system',
      content: message.text,
    };
  });

  const payload: OpenAiStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };

  const stream = await OpenAiStream(payload);
  console.log(stream);

  return new Response(stream);
}
