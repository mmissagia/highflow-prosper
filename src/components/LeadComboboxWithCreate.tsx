import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import useUnifiedLeads from "@/hooks/useUnifiedLeads";
import type { UnifiedLead } from "@/types/lead";

interface LeadComboboxWithCreateProps {
  value: string | null;
  onSelect: (lead: UnifiedLead | null) => void;
  onRequestCreate: (initialQuery: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const normalize = (s: string) => s.trim().toLowerCase();
const digits = (s: string) => s.replace(/\D/g, "");

export default function LeadComboboxWithCreate({
  value,
  onSelect,
  onRequestCreate,
  placeholder = "Selecione um lead...",
  disabled,
}: LeadComboboxWithCreateProps) {
  const { leads, isLoading, error } = useUnifiedLeads();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => leads.find((l) => l.id === value) ?? null,
    [leads, value]
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    const qDigits = digits(query);
    if (!q) return leads;
    return leads.filter((l) => {
      if (normalize(l.name).includes(q)) return true;
      if (l.email && normalize(l.email).includes(q)) return true;
      if (qDigits && l.phone && digits(l.phone).includes(qDigits)) return true;
      return false;
    });
  }, [leads, query]);

  const exactMatch = useMemo(() => {
    const q = normalize(query);
    const qDigits = digits(query);
    if (!q) return null;
    return leads.find((l) => {
      if (l.email && normalize(l.email) === q) return true;
      if (qDigits && l.phone && digits(l.phone) === qDigits) return true;
      return false;
    }) ?? null;
  }, [leads, query]);

  const showCreate = query.trim().length > 0 && !exactMatch;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal h-auto py-2"
        >
          {selected ? (
            <span className="flex flex-col items-start text-left min-w-0">
              <span className="truncate font-medium text-foreground">{selected.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {selected.email ?? selected.phone ?? ""}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nome, email ou telefone..."
            value={query}
            onValueChange={setQuery}
          />
          {error && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground border-b">
              Erro ao carregar leads — mostrando dados locais
            </p>
          )}
          <CommandList>
            {isLoading ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 rounded-md bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {filtered.length === 0 && !showCreate && (
                  <CommandEmpty>Nenhum lead encontrado.</CommandEmpty>
                )}
                {filtered.length > 0 && (
                  <CommandGroup>
                    {filtered.map((lead) => (
                      <CommandItem
                        key={lead.id}
                        value={lead.id}
                        onSelect={() => {
                          onSelect(lead);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm truncate">{lead.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {lead.email ?? lead.phone ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {lead.stage}
                          </Badge>
                          {value === lead.id && <Check className="h-3.5 w-3.5 text-primary" />}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {showCreate && (
                  <CommandGroup className={cn(filtered.length > 0 && "border-t")}>
                    <CommandItem
                      value={`__create__${query}`}
                      onSelect={() => {
                        onRequestCreate(query);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="text-primary py-3"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="font-medium">
                        Cadastrar novo lead com "{query}"
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}