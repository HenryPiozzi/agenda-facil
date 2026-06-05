# ADR-002: Adotar Express.js como framework web

**Status:** Accepted

---

## Contexto

Com a adoção de TypeScript/Node.js (ADR-001-linguagem-typescript.md), o
grupo avaliou os frameworks web disponíveis no ecossistema:

| Framework | Prós | Contras |
|-----------|------|---------|
| **Express** | Minimalista, amplamente documentado, grande comunidade | Sem tipagem nativa, middleware manual |
| **Fastify** | Alta performance, schema validation embutida | Menos familiar para o grupo |
| **NestJS** | Arquitetura opinionada, decorators DI | Overhead elevado para o escopo do projeto |

O atributo de qualidade **manutenibilidade** guiou a escolha: queríamos
um framework que não impusesse sua própria arquitetura, permitindo aplicar
Clean Architecture de forma explícita e didática — o que é o objetivo
central do trabalho.

---

## Decisão

Adotamos **Express 4.x** como framework HTTP da aplicação.

A geração da especificação OpenAPI é feita manualmente via `openapi.yaml`
versionado no repositório. Essa abordagem foi preferida por tornar o
contrato da API explícito, independente do framework e sempre revisado
pelo time.

---

## Consequências

**Benefícios:**
- Framework sem opinião: a organização em camadas (domain/application/
  infrastructure/api) é inteiramente controlada pelo grupo, não pelo
  framework.
- Curva de aprendizado mínima — Express é amplamente conhecido.
- Leveza: adiciona menos de 200 KB ao bundle final.

**Custos:**
- Ausência de geração automática de OpenAPI — a spec deve ser mantida
  manualmente e pode ficar desatualizada se não houver disciplina.
- Sem injeção de dependências nativa — wiring manual no `server.ts`.
- Tratamento de erros em rotas assíncronas exige wrapper explícito
  (`tryCatch` em `server.ts`).
