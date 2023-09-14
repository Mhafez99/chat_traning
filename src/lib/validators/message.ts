import { z } from 'zod';

export const MessageSchema = z.object({
  isUserMessage: z.boolean(),
  text: z.string(),
  chatId: z.string(),
  messageId: z.string(),
});

// array validator

export const MessageArraySchema = z.array(MessageSchema);

export type Message = z.infer<typeof MessageSchema>;
