# AgendaFácil

Sistema de agendamento de serviços desenvolvido como trabalho final da disciplina 12452 — Padrões e Arquitetura de Software (PUC-Campinas).

**Stack:** TypeScript · Express · SQLite · HTML/CSS/JS

---

## Como rodar

### Pré-requisitos
- Node.js 18 ou superior
- npm

### Passo a passo

```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Suba o servidor
npm run dev
```

Abra o navegador em **http://localhost:3000** — o frontend já aparece.

---

## Estrutura do projeto

```
agendafacil/
├── backend/
│   └── src/
│       ├── domain/          # Entidades e regras de negócio puras
│       ├── application/     # Casos de uso
│       ├── infrastructure/  # SQLite, notificações
│       └── api/             # Express server
├── frontend/
│   └── index.html           # Interface web
├── adrs/                    # Architectural Decision Records
└── diagrams/                # Diagramas Mermaid
```

## Arquitetura

**Macro:** Monolito modular — um único processo serve a API e o frontend estático.

**Interna:** Clean Architecture — camadas com dependência unidirecional:
```
API (Express) → Application (Use Cases) → Domain (Entidades)
                      ↓
              Infrastructure (SQLite, Notificações)
```

## Padrões GoF

| Padrão | Categoria | Arquivo |
|--------|-----------|---------|
| Factory Method | Criação | `src/domain/factories.ts` |
| Strategy | Comportamento | `src/domain/schedulingStrategy.ts` |
| Observer | Comportamento | `src/infrastructure/notificationService.ts` |
