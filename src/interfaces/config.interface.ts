export interface Config {
  chatId: string;
  userId?: string;
  systemMask: string;
  model: string;
  temperature: number;
  topP: number;
  n: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
}
