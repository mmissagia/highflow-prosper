import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Olá! 👋 Sou o HighFlow AI, seu assistente inteligente. Posso ajudar com:\n\n• Análise de performance de leads e closers\n• Sugestões de próximas ações\n• Resumos de campanhas e eventos\n• Insights sobre métricas comerciais\n\nComo posso ajudar?",
  },
];

export function AIChatTab() {
  const [messages] = useState<ChatMessage[]>(initialMessages);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Sparkles className="w-2.5 h-2.5 mr-0.5" />IA
        </Badge>
        <span className="text-[10px] text-muted-foreground">Respostas geradas por inteligência artificial</span>
      </div>

      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
          {msg.role === "assistant" && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(221,83%,53%)] to-[hsl(270,65%,55%)] flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <div
            className={`rounded-xl px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed whitespace-pre-line ${
              msg.role === "assistant"
                ? "bg-muted/60 text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
