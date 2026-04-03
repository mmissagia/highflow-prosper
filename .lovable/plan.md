

## Diagnóstico

A tabela `users_access` tem uma política RLS de SELECT que restringe a visualização apenas ao próprio registro do usuário:

```sql
USING (auth.uid() = user_id)
```

Isso significa que cada usuário só vê a si mesmo na lista — nunca os demais.

## Plano

### 1. Atualizar a política RLS de SELECT na tabela `users_access`

Substituir a política atual de SELECT por uma que permita qualquer usuário autenticado ver todos os registros:

```sql
DROP POLICY "Users can view their own users_access" ON public.users_access;

CREATE POLICY "Authenticated users can view all users_access"
  ON public.users_access
  FOR SELECT
  TO authenticated
  USING (true);
```

Isso é apropriado porque a tela de Usuários é uma ferramenta administrativa onde o gestor precisa ver toda a equipe.

### 2. Manter as demais políticas restritivas

As políticas de INSERT, UPDATE e DELETE continuam exigindo `auth.uid() = user_id`, garantindo que um usuário não possa modificar ou excluir registros de outros sem autorização.

### Segurança

- A tabela `users_access` contém apenas nome, email, papel e status — dados de equipe, não dados sensíveis como senhas ou chaves.
- Permitir leitura entre membros autenticados é o padrão esperado para gestão de equipe.

### Resultado

Após a migração, missagia@gmail (e qualquer usuário logado) verá todos os membros na lista de `/usuarios`.

