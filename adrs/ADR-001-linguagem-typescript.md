# ADR-001: Adotar TypeScript como linguagem principal

**Status:** Accepted  
**Supersede:** ~~ADR-001-linguagem-python.md~~ (ver histórico abaixo)

---

## Contexto

O grupo avaliou inicialmente Python 3.11+ como linguagem principal, dado o
histórico da disciplina. Contudo, ao iniciar a implementação na Semana 2,
dois fatores motivaram a revisão:

1. **Tipagem estática nativa**: TypeScript oferece verificação de tipos em
   tempo de compilação sem a necessidade de ferramentas externas (mypy).
   Isso favorece o atributo de qualidade **manutenibilidade** — erros de
   contrato entre camadas são detectados antes de executar o código.

2. **Ecossistema Node.js para API + Frontend**: A stack Node.js permite
   servir o frontend estático pelo mesmo processo que a API, eliminando a
   necessidade de um servidor web separado (nginx, Caddy) no ambiente de
   desenvolvimento. Isso reduz a fricção de configuração para todos os
   integrantes.

A alternativa Python/FastAPI foi descartada neste momento (ver
ADR-001-linguagem-python.md, status Superseded) por exigir configuração
de ambiente virtual e hot-reload separados para o frontend.

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
