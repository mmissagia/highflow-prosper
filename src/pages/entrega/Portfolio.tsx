import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Portfolio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfólio</h1>
        <p className="text-muted-foreground">
          Visão agregada de todos os produtos conectados (cursos, mentorias, comunidades).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta tela será populada em F9-C com a visão completa de produtos conectados,
            performance agregada e métricas por produto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}