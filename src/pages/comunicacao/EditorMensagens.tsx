import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PenTool, Sparkles, MessageCircle, Mail, Send, RefreshCw } from "lucide-react";
import { AIBadge, AISuggestionCard } from "@/components/ai";
import { getMessageSuggestions } from "@/lib/aiMocks";
import { toast } from "sonner";

const placeholders = [
  { key: "{{nome}}", description: "Nome do lead" },
  { key: "{{evento}}", description: "Nome do evento" },
  { key: "{{pitch}}", description: "Nome do pitch" },
  { key: "{{link_sun}}", description: "Link do Checkout SUN" },
  { key: "{{data}}", description: "Data do evento" },
  { key: "{{preco}}", description: "Preço do produto" },
  { key: "{{bonus}}", description: "Lista de bônus" },
];

export function EditorContent() {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const aiSuggestions = getMessageSuggestions();

  const insertPlaceholder = (placeholder: string) => {
    setMessage((prev) => prev + placeholder);
  };

  const applySuggestion = (text: string) => {
    setMessage(text);
  };

  const handleGenerateNew = () => {
    toast("Gerando novas sugestões...");
    setTimeout(() => {
      toast.success("3 novas sugestões prontas");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editor de Mensagens</h1>
          <p className="text-muted-foreground">Crie mensagens personalizadas com placeholders e IA</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Salvar Rascunho</Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Enviar Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Configuração */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Mensagem</Label>
                  <Input placeholder="Ex: Follow-up Evento Janeiro" />
                </div>
                <div className="space-y-2">
                  <Label>Canal</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui... Use os placeholders para personalizar."
                rows={8}
                className="font-mono"
              />

              <div>
                <Label className="mb-2 block">Placeholders Disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {placeholders.map((p) => (
                    <Button
                      key={p.key}
                      variant="outline"
                      size="sm"
                      onClick={() => insertPlaceholder(p.key)}
                      className="font-mono text-xs"
                    >
                      {p.key}
                    </Button>
                  ))}
                </div>
              </div>

              {message && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <Label className="mb-2 block text-sm">Pré-visualização</Label>
                  <p className="text-sm whitespace-pre-wrap">
                    {message
                      .replace("{{nome}}", "João Silva")
                      .replace("{{evento}}", "Imersão High-Ticket")
                      .replace("{{pitch}}", "Mentoria Elite")
                      .replace("{{link_sun}}", "https://sun.co/mentoria-elite")
                      .replace("{{data}}", "20/01/2024")
                      .replace("{{preco}}", "R$ 12.000")
                      .replace("{{bonus}}", "Comunidade VIP + Sessão individual")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Sugestões IA */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AIBadge />
                Sugestões de Copy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => applySuggestion(suggestion.description)}
                  className="w-full text-left bg-background rounded-lg hover:border-primary/50 transition-colors"
                >
                  <AISuggestionCard suggestion={suggestion} />
                </button>
              ))}

              <Button variant="outline" size="sm" className="w-full" onClick={handleGenerateNew}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar nova sugestão
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Use emojis para aumentar engajamento</p>
              <p>• Mensagens curtas têm maior taxa de resposta</p>
              <p>• Inclua sempre um CTA claro</p>
              <p>• Personalize com o nome do lead</p>
              <p>• Use urgência com moderação</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditorMensagens() {
  return <EditorContent />;
}
