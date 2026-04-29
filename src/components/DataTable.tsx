import { ReactNode, useState } from "react";
import { ChevronRight, MoreVertical, type LucideIcon } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
  /** Quando true, esta coluna fica oculta por default e revela em hover (tooltip lateral) */
  expandable?: boolean;
}

export interface DataTableAction<T> {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
}

export interface DataTableEmptyState {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  emptyState?: DataTableEmptyState;
  rowKey: (row: T) => string;
  className?: string;
}

const alignClass = (a?: "left" | "right" | "center") =>
  a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

export function DataTable<T>({
  data,
  columns,
  actions,
  onRowClick,
  emptyState,
  rowKey,
  className,
}: DataTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const defaultCols = columns.filter((c) => !c.expandable);
  const expandableCols = columns.filter((c) => c.expandable);
  const hasExpandable = expandableCols.length > 0;

  if (data.length === 0 && emptyState) {
    const Icon = emptyState.icon;
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-base font-semibold text-foreground mb-1">{emptyState.title}</h3>
        {emptyState.description && (
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {emptyState.description}
          </p>
        )}
        {emptyState.cta}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("w-full", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {defaultCols.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    "text-micro uppercase tracking-wider text-muted-foreground",
                    alignClass(col.align)
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </TableHead>
              ))}
              {hasExpandable && <TableHead className="w-8" />}
              {actions && actions.length > 0 && (
                <TableHead className="text-right text-micro uppercase tracking-wider text-muted-foreground w-[140px]">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const key = rowKey(row);
              const isHovered = hoveredRow === key;
              return (
                <TableRow
                  key={key}
                  onMouseEnter={() => setHoveredRow(key)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-shadow duration-instant ease-glide motion-reduce:transition-none",
                    isHovered && "shadow-xs",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {defaultCols.map((col) => (
                    <TableCell key={col.id} className={alignClass(col.align)}>
                      {col.accessor(row)}
                    </TableCell>
                  ))}
                  {hasExpandable && (
                    <TableCell className="w-8 p-0 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-opacity duration-instant ease-glide motion-reduce:transition-none",
                              isHovered ? "opacity-100" : "opacity-30"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRowClick) onRowClick(row);
                            }}
                            aria-label="Ver mais"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <div className="space-y-1.5">
                            {expandableCols.map((col) => (
                              <div key={col.id} className="flex items-center justify-between gap-4 text-xs">
                                <span className="text-micro uppercase tracking-wider text-muted-foreground">
                                  {col.header}
                                </span>
                                <span className="font-medium">{col.accessor(row)}</span>
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  )}
                  {actions && actions.length > 0 && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5">
                        <div
                          className={cn(
                            "flex items-center gap-0.5 transition-opacity duration-instant ease-glide motion-reduce:transition-none",
                            isHovered ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {actions.slice(0, 3).map((action) => {
                            const Icon = action.icon;
                            return (
                              <Tooltip key={action.id}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => action.onClick(row)}
                                    aria-label={action.label}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{action.label}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Mais ações">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action) => {
                              const Icon = action.icon;
                              return (
                                <DropdownMenuItem
                                  key={action.id}
                                  onClick={() => action.onClick(row)}
                                  className={cn(
                                    action.variant === "destructive" &&
                                      "text-destructive focus:text-destructive"
                                  )}
                                >
                                  <Icon className="h-3.5 w-3.5 mr-2" />
                                  {action.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}