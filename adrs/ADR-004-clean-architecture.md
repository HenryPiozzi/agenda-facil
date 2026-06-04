# ADR-004: Adotar Clean Architecture como organização interna do código

**Status:** Accepted

---

## Contexto

O grupo avaliou três estilos de organização interna:

1. **MVC clássico** — familiar, mas tende a concentrar lógica nos controllers.
2. **Organização por feature** — simples para projetos pequenos, mas dificulta
   reuso de regras de negócio.
3. **Clean Architecture (Robert C. Martin)** — separa explicitamente domínio,
   casos de uso e infraestrutura por meio da Regra da Dependência.

O atributo de qualidade **manutenibilidade** é prioritário. A Clean Architecture
garante que as regras de negócio (domínio) nunca dependam de banco de dados,
framework ou protocolo HTTP — elas podem ser testadas de forma isolada e
alteradas sem efeito cascata nas outras camadas.

---

## Decisão

Adotamos **Clean Architecture** com quatro camadas explícitas:

```
src/
├── domain/          ← Entidades e interfaces (nenhuma dependência externa)
├── application/     ← Casos de uso (orquestra domínio)
├── infrastructure/  ← Banco, notificações (implementa interfaces do domínio)
└── api/             ← Rotas Express.js — server.ts (usa casos de uso)
```

A **Regra da Dependência** é aplicada estritamente:
- `domain` não importa nada de fora de si mesmo.
- `application` importa apenas `domain`.
- `infrastructure` importa `domain` (para implementar suas interfaces).
- `api` importa `application` e `infrastructure` (para injeção de dependências).

---

## Consequências

**Benefícios:**
- Domínio completamente testável sem banco de dados ou servidor HTTP.
- Troca de banco, framework ou protocolo afeta apenas a camada externa.
- Alinhamento direto com os princípios SOLID (especialmente DIP e SRP).

**Custos:**
- Mais arquivos e mais indireção que uma arquitetura flat.
- Requer disciplina para não "vazar" dependências entre camadas.
- Curva de aprendizado inicial para integrantes não familiarizados.
