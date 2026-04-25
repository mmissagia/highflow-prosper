import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, MessageCircle, Plus, Settings, Users, Shield, Filter, Bell, FileText, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AIBadge } from '@/components/ai';
import { useCopilot } from '@/hooks/useCopilot';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SHORTCUTS: { emoji: string; label: string; prompt: string }[] = [
  { emoji: '📊', label: 'Resumo de hoje', prompt: 'Como estamos hoje?' },
  { emoji: '🔥', label: 'Leads quentes', prompt: 'Quais são os leads quentes que estão parados?' },
  { emoji: '💳', label: 'Pagamentos pendentes', prompt: 'Tenho pagamentos em risco?' },
  { emoji: '📣', label: 'Campanhas', prompt: 'Qual campanha está convertendo melhor?' },
  { emoji: '🎪', label: 'Eventos', prompt: 'Como estão meus próximos eventos?' },
  { emoji: '📈', label: 'Performance do time', prompt: 'Quem do meu time está abaixo da meta?' },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Copiloto() {
  const { messages, isLoading, sendMessage, clearConversation } = useCopilot();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShortcut = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-6">
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Atalhos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {SHORTCUTS.map((s) => (
              <Button
                key={s.label}
                variant="ghost"
                size="sm"
                className="justify-start w-full font-normal"
                onClick={() => handleShortcut(s.prompt)}
                disabled={isLoading}
              >
                <span className="mr-2">{s.emoji}</span>
                {s.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 mt-auto">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                No tier <span className="font-medium text-foreground">Scale</span>, este Copiloto
                fica disponível também pelo seu WhatsApp. Pergunte a operação em qualquer lugar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <h1 className="text-lg font-semibold">Copiloto WhatsApp IA</h1>
            <AIBadge />
          </div>
          <Button variant="outline" size="sm" onClick={clearConversation} disabled={messages.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            Nova conversa
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Configurações do Copiloto">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Governança</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/acessos')}>
                <Users className="h-4 w-4" /> Acessos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/perfis')}>
                <Shield className="h-4 w-4" /> Perfis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/escopo')}>
                <Filter className="h-4 w-4" /> Escopo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/alertas')}>
                <Bell className="h-4 w-4" /> Alertas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/logs')}>
                <FileText className="h-4 w-4" /> Logs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ia/copiloto/simulacao')}>
                <Smartphone className="h-4 w-4" /> Simulação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Pergunte qualquer coisa sobre sua operação. Tente os atalhos rápidos à esquerda
                para começar.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}
              >
                {m.role === 'user' ? (
                  <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 text-sm whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-muted rounded-2xl rounded-tl-sm p-3 text-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                        Copiloto
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-foreground">{m.content}</div>
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {formatTime(m.timestamp)}
                </span>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="max-w-[80%] bg-muted rounded-2xl rounded-tl-sm p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                    Copiloto
                  </span>
                </div>
                <div className="flex items-center gap-1 py-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border px-4 pt-4 pb-4 shrink-0">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre sua operação..."
              disabled={isLoading}
              rows={1}
              className="min-h-[40px] max-h-[120px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}