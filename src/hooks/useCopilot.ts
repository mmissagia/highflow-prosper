import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCopilotOperationSnapshot } from '@/lib/aiMocks';

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    setError(null);

    const newUserMessage: CopilotMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('copilot', {
        body: {
          systemPrompt: getCopilotOperationSnapshot(),
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const assistantMessage: CopilotMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `⚠️ Desculpe, não consegui responder agora. ${errorMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearConversation };
}