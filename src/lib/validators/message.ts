import { z } from 'zod';

export const MessageSchema = z.object({
  messageId: z.string(),
  isUserMessage: z.boolean(),
  text: z.string(),
  chatId: z.string(),
});

// array validator

export const MessageArraySchema = z.array(MessageSchema);

export type Message = z.infer<typeof MessageSchema>;
