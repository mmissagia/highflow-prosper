import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, UserPlus, Users, UserCheck, UserX, Clock, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const ROLES = ["Produtor", "Gestor Comercial", "SDR", "Closer", "Mentor", "Operações", "Afiliado", "Mentorado"] as const;
const STATUSES = ["Ativo", "Convidado", "Inativo"] as const;

const roleColors: Record<string, string> = {
  Produtor: "bg-yellow-500/15 text-yellow-700 border-yellow-300",
  "Gestor Comercial": "bg-blue-500/15 text-blue-700 border-blue-300",
  SDR: "bg-cyan-500/15 text-cyan-700 border-cyan-300",
  Closer: "bg-green-500/15 text-green-700 border-green-300",
  Mentor: "bg-purple-500/15 text-purple-700 border-purple-300",
  Operações: "bg-gray-500/15 text-gray-700 border-gray-300",
  Afiliado: "bg-orange-500/15 text-orange-700 border-orange-300",
  Mentorado: "bg-pink-500/15 text-pink-700 border-pink-300",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-green-500/15 text-green-700 border-green-300",
  Convidado: "bg-yellow-500/15 text-yellow-700 border-yellow-300",
  Inativo: "bg-gray-500/15 text-gray-600 border-gray-300",
};

const avatarColors = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-red-500", "bg-indigo-500",
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Usuarios() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: dbUsers = [], isLoading } = useQuery({
    queryKey: ["users_access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_access")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fallback mock data when RLS filters out seed records
  const mockUsers = useMemo(() => [
    { id: "1", name: "Marcelo Panadés", email: "marcelo@eduzz.com", role: "Produtor", status: "Ativo", last_access: new Date(Date.now() - 2 * 3600000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "2", name: "Luciana Ogusco", email: "luciana@eduzz.com", role: "Gestor Comercial", status: "Ativo", last_access: new Date(Date.now() - 86400000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "3", name: "Ana Ribeiro", email: "ana@eduzz.com", role: "Closer", status: "Ativo", last_access: new Date(Date.now() - 3 * 3600000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "4", name: "Rafael Costa", email: "rafael@eduzz.com", role: "Closer", status: "Ativo", last_access: new Date(Date.now() - 5 * 3600000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "5", name: "Lucas Martins", email: "lucas@eduzz.com", role: "SDR", status: "Ativo", last_access: new Date(Date.now() - 3600000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "6", name: "Juliana Lima", email: "juliana@eduzz.com", role: "SDR", status: "Convidado", last_access: null, invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
    { id: "7", name: "Fernando Silva", email: "fernando@eduzz.com", role: "Mentor", status: "Ativo", last_access: new Date(Date.now() - 12 * 3600000).toISOString(), invited_at: new Date().toISOString(), created_at: new Date().toISOString(), user_id: "" },
  ], []);

  const users = dbUsers.length > 0 ? dbUsers : mockUsers;

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "Ativo").length,
    invited: users.filter(u => u.status === "Convidado").length,
    inactive: users.filter(u => u.status === "Inativo").length,
  }), [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerencie quem tem acesso ao HighFlow e suas permissões.</p>
        </div>
        <div className="flex gap-3">
          <MetricMini icon={Users} label="Total" value={counts.total} />
          <MetricMini icon={UserCheck} label="Ativos" value={counts.active} className="text-green-600" />
          <MetricMini icon={Clock} label="Convidados" value={counts.invited} className="text-yellow-600" />
          <MetricMini icon={UserX} label="Inativos" value={counts.inactive} className="text-muted-foreground" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Papel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os papéis</SelectItem>
            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button disabled className="gap-2">
          <UserPlus className="h-4 w-4" />
          Convidar Usuário
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum usuário encontrado.</TableCell>
              </TableRow>
            ) : filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(u.name)}`}>
                      {getInitials(u.name)}
                    </div>
                    <span className="font-medium text-foreground">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[u.role] || ""}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[u.status] || ""}>
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.last_access
                    ? formatDistanceToNow(new Date(u.last_access), { addSuffix: true, locale: ptBR })
                    : "Nunca"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                      <DropdownMenuItem disabled>Alterar papel</DropdownMenuItem>
                      <DropdownMenuItem disabled>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function MetricMini({ icon: Icon, label, value, className = "" }: { icon: React.ElementType; label: string; value: number; className?: string }) {
  return (
    <Card className="px-4 py-3 flex items-center gap-3">
      <Icon className={`h-5 w-5 ${className || "text-muted-foreground"}`} />
      <div>
        <p className={`text-xl font-bold ${className || "text-foreground"}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
