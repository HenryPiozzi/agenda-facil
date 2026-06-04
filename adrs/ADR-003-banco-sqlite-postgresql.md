# ADR-003: SQLite em desenvolvimento, PostgreSQL em produção

**Status:** Accepted

---

## Contexto

O sistema precisa de persistência relacional. As restrições do projeto são:
- Ambiente de desenvolvimento dos integrantes é variado (Windows, macOS, Linux).
- O prazo não comporta a configuração de um servidor de banco de dados
  para cada máquina do time.
- Em produção real, os requisitos de concorrência e integridade justificam
  um banco mais robusto.

A arquitetura Clean Architecture com repositórios abstratos (interfaces
TypeScript em `src/domain/repositories.ts`) permite trocar o banco de dados
sem alterar nenhuma regra de negócio — apenas a implementação concreta do
repositório muda.

---

## Decisão

Usar **SQLite** (arquivo local via `better-sqlite3`) em desenvolvimento.
Em produção, a troca seria feita implementando os mesmos contratos de
repositório com um driver PostgreSQL (`pg` ou `Prisma`), sem tocar no
domínio ou nos casos de uso.

O banco é criado automaticamente na primeira execução pelo método
`createDatabase()` em `src/infrastructure/repositoriesImpl.ts`.

---

## Consequências

**Benefícios:**
- Zero configuração para desenvolvimento: qualquer integrante clona,
  roda `npm install && npm run dev` e o banco já existe.
- `better-sqlite3` é síncrono, simplificando o código sem callbacks ou
  Promises desnecessárias para o escopo do projeto.
- As interfaces de repositório garantem que trocar o banco afeta apenas
  a camada de infraestrutura.

**Custos:**
- SQLite não suporta concorrência de escrita — aceitável em desenvolvimento.
- `better-sqlite3` é uma dependência nativa (requer build tools) — pode
  gerar problemas em ambientes sem Python/MSVC para compilação.
- Diferenças de dialeto entre SQLite e PostgreSQL (tipos, case-sensitivity)
  podem mascarar bugs que só aparecem em produção.
