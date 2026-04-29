import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { key: "⌘K", desc: "Abrir paleta de comandos" },
  { key: "⌘B", desc: "Recolher/expandir sidebar" },
  { key: "⌘/", desc: "Mostrar atalhos" },
  { key: "G D", desc: "Ir para Dashboard" },
  { key: "G P", desc: "Ir para Pipeline" },
  { key: "G C", desc: "Ir para Comissões" },
  { key: "C", desc: "Criar (contextual)" },
  { key: "/", desc: "Focar busca" },
  { key: "Esc", desc: "Fechar overlay" },
];

export function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atalhos de teclado</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-1 border-b border-border last:border-0"
            >
              <span className="text-sm text-foreground">{s.desc}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}