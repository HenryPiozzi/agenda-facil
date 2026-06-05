# ADR-001: Adotar TypeScript como linguagem principal

**Status:** Accepted

---

## Contexto

O grupo optou por TypeScript/Node.js desde o início do projeto. Os fatores
que motivaram essa escolha foram:

1. **Tipagem estática nativa**: TypeScript oferece verificação de tipos em
   tempo de compilação sem ferramentas externas. Isso favorece o atributo de
   qualidade **manutenibilidade** — erros de contrato entre camadas são
   detectados antes de executar o código.

2. **Stack unificada (API + Frontend)**: Node.js permite servir o frontend
   estático pelo mesmo processo que a API, eliminando a necessidade de um
   servidor web separado no ambiente de desenvolvimento e reduzindo a fricção
   de configuração para todos os integrantes.

---

## Decisão

Adotamos **TypeScript 5.x** com **Node.js 18+** como linguagem e runtime
únicos do projeto.

---

## Consequências

**Benefícios:**
- Verificação de tipos em tempo de compilação — detecta incompatibilidades
  entre camadas da Clean Architecture antes de executar.
- Um único `npm run dev` sobe toda a aplicação (API + frontend estático).
- Interfaces TypeScript mapeiam diretamente para os contratos da Clean
  Architecture (repositórios, use cases).
- Ecossistema maduro para APIs REST (Express, fastify) e ORM/query builders.

**Custos:**
- Integrantes com menos experiência em TypeScript precisaram de ramp-up
  inicial de ~2 dias.
- O passo de compilação (`tsc`) adiciona latência no ciclo de
  desenvolvimento (mitigado com `ts-node` em modo dev).
- Tipagem dinâmica no acesso a linhas do banco (`any`) exige cuidado manual
  nos repositórios de infraestrutura.
