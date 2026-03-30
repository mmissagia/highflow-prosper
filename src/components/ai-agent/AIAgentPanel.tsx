import { useState } from "react";
import { X, Brain, Send, AlertTriangle, Zap, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AIBriefingTab } from "./tabs/AIBriefingTab";
import { AIAlertasTab } from "./tabs/AIAlertasTab";
import { AICopilotoTab } from "./tabs/AICopilotoTab";
import { AIChatTab } from "./tabs/AIChatTab";

interface AIAgentPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIAgentPanel({ open, onOpenChange }: AIAgentPanelProps) {
  const [activeTab, setActiveTab] = useState("briefing");
  const [quickMessage, setQuickMessage] = useState("");
  const alertCount = 8;

  const handleQuickSend = () => {
    if (!quickMessage.trim()) return;
    setActiveTab("chat");
    setQuickMessage("");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[400px] max-w-[95vw] bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-[hsl(221,83%,53%)] to-[hsl(270,65%,55%)]">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-base">HighFlow AI</span>
              <Badge className="bg-white/20 text-white border-white/30 text-[10px] px-1.5 py-0 hover:bg-white/30">Beta</Badge>
            </div>
            <p className="text-white/70 text-xs">Assistente inteligente</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-3 mb-1 bg-muted/60">
            <TabsTrigger value="briefing" className="text-xs flex-1">
              <FileText className="w-3.5 h-3.5 mr-1" />Briefing
            </TabsTrigger>
            <TabsTrigger value="alertas" className="text-xs flex-1 relative">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />Alertas
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] rounded-full flex items-center justify-center font-bold">{alertCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="copiloto" className="text-xs flex-1">
              <Zap className="w-3.5 h-3.5 mr-1" />Copiloto
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs flex-1">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />Chat
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="briefing" className="m-0 p-4">
              <AIBriefingTab />
            </TabsContent>
            <TabsContent value="alertas" className="m-0 p-4">
              <AIAlertasTab />
            </TabsContent>
            <TabsContent value="copiloto" className="m-0 p-4">
              <AICopilotoTab />
            </TabsContent>
            <TabsContent value="chat" className="m-0 p-4">
              <AIChatTab />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <Input
              placeholder="Pergunte algo..."
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickSend()}
              className="flex-1 text-sm"
            />
            <Button size="icon" onClick={handleQuickSend} disabled={!quickMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
