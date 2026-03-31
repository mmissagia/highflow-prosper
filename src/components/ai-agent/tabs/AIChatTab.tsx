import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
    "Olá! 👋 Sou o **HighFlow AI**, seu copiloto de vendas. Posso analisar seus dados, sugerir ações e responder suas dúvidas sobre a operação.\n\nComo posso ajudar?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("lead") || lower.includes("leads")) {
    return "📊 **Resumo da sua base de leads:**\n\nVocê tem **24 leads ativos** no momento.\n- 🔥 8 estão em fase quente (Warm ou superior)\n- 📞 5 com calls agendadas esta semana\n- ⏳ 11 em fase de nutrição\n\nO lead com maior potencial é **Maria Santos** — R$ 25k, score 92. Recomendo priorizar o follow-up com ela hoje.\n\n✨ *Análise gerada com base nos dados do CRM*";
  }

  if (lower.includes("pipeline") || lower.includes("funil")) {
    return "📈 **Análise do Pipeline:**\n\n| Estágio | Leads | Conversão |\n|---------|-------|-----------|\n| Lead Frio | 11 | — |\n| Warm | 5 | 45% |\n| Call Agendada | 4 | 80% |\n| Follow-up | 3 | 67% |\n| Fechamento | 1 | 100% |\n\n⚠️ **Gargalo identificado:** A conversão de Lead Frio → Warm está em **34%**, abaixo da média de 52%. Sugestão: revisar o script de qualificação.\n\n✨ *Análise gerada por IA*";
  }

  if (lower.includes("evento") || lower.includes("eventos")) {
    return "🎯 **Próximos Eventos:**\n\n1. **Workshop Closer** — em 3 dias\n   - 12/20 inscritos (60%)\n   - Sugestão: enviar lembrete para leads qualificados\n\n2. **Mastermind Summit** — em 10 dias\n   - 45% das vagas preenchidas\n   - Ritmo atual não alcança a meta\n\n3. **Mentoria Elite** — em 18 dias\n   - Conversão pós-evento histórica de 18% (top performer)\n\n✨ *Dados dos módulos de Eventos*";
  }

  if (lower.includes("equipe") || lower.includes("time") || lower.includes("closer")) {
    return "👥 **Performance da Equipe:**\n\n🥇 **Ana Ribeiro** — 23 leads ativos, 4 fechamentos no mês, taxa 28%\n🥈 **Lucas Martins** — 15 leads ativos, 2 fechamentos, taxa 18%\n🥉 **Rafael Costa** — 12 leads ativos, 1 fechamento, taxa 12%\n\n⚠️ Rafael está 8% abaixo da média. Ana pode estar sobrecarregada com 23 leads (média: 15).\n\n💡 **Sugestão:** Redistribuir 5 leads da Ana para o Rafael e agendar sessão de coaching.\n\n✨ *Ranking baseado nos últimos 30 dias*";
  }

  if (lower.includes("meta") || lower.includes("receita") || lower.includes("faturamento")) {
    return "💰 **Projeção de Receita:**\n\n- Meta do mês: **R$ 500.000**\n- Receita confirmada: **R$ 312.000** (62%)\n- Pipeline qualificado: **R$ 487.000**\n- Projeção otimista: **R$ 535.000** ✅\n- Projeção conservadora: **R$ 420.000** ⚠️\n\n📌 Se fechar os 4 leads em Follow-up (R$ 175k total), ultrapassa a meta.\n\nLead mais próximo do fechamento: **João Silva** — R$ 45k, reunião de proposta amanhã.\n\n✨ *Projeção calculada por IA*";
  }

  return "Entendido! Essa análise requer acesso a dados mais profundos. Em breve poderei responder isso com mais detalhes.\n\nPor enquanto, posso te ajudar com:\n• **Leads** — resumo e priorização\n• **Pipeline** — análise de funil\n• **Eventos** — ocupação e próximos\n• **Equipe** — ranking de performance\n• **Metas** — projeção de receita\n\nDigite um desses temas! 😊";
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[hsl(270,65%,55%)] flex items-center justify-center shrink-0 mt-0.5">
        <Brain className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
      <div className="rounded-xl px-4 py-3 bg-muted/60">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function AIChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const response: ChatMessage = { role: "assistant", content: getAIResponse(msg) };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div className="flex flex-col gap-3 min-h-[300px]">
      <div className="flex items-center gap-1.5 mb-1">
        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Sparkles className="w-2.5 h-2.5 mr-0.5" />
          IA
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          Respostas geradas por inteligência artificial
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 animate-fade-in ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[hsl(270,65%,55%)] flex items-center justify-center shrink-0 mt-0.5">
                <Brain className="w-3.5 h-3.5 text-primary-foreground" />
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
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Inline input */}
      <div className="flex gap-2 mt-2 sticky bottom-0">
        <Input
          placeholder="Pergunte sobre leads, pipeline, eventos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 text-sm"
          disabled={isTyping}
        />
        <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
