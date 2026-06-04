# ADR-005: Substituir autenticação por sessão em cookie por JWT

**Status:** Superseded por ADR-005b (decisão revertida durante o desenvolvimento)

---

## Contexto

Durante a Semana 1, o grupo decidiu implementar autenticação via **sessão
em cookie** (server-side session), seguindo o padrão clássico de aplicações
web. A decisão foi registrada aqui inicialmente como Accepted.

Na Semana 2, ao iniciar a implementação, identificamos dois problemas:

1. **Incompatibilidade com o estilo API-first**: sessões server-side exigem
   estado no servidor, o que contradiz o princípio REST de statelessness.
   No Express, sessões exigem middleware adicional (`express-session`) com
   armazenamento persistente (Redis ou banco), aumentando a complexidade
   sem benefício claro para o escopo do projeto.

2. **Dificuldade de teste**: testes de integração com sessões exigiriam
   gerenciar cookies manualmente no cliente de teste, complicando os
   casos de teste sem agregar valor à demonstração dos padrões arquiteturais.

---

## Decisão original (revertida)

~~Usar sessão em cookie com `express-session` para autenticação.~~

---

## Nova decisão (ADR-005b)

Adotamos **autenticação via JWT (JSON Web Token)** como estratégia para
uma versão de produção do sistema. O token seria enviado no header
`Authorization: Bearer <token>` e validado por middleware Express.

**Por que JWT é melhor neste contexto:**
- Stateless — alinhado com REST e com os princípios da Clean Architecture.
- Testável: o token é uma string simples, fácil de incluir em testes.
- Alinha-se ao DIP: o middleware de autenticação pode ser injetado como
  dependência na camada de API, sem tocar no domínio.

**Escopo atual:** a implementação de autenticação está fora do escopo
deste trabalho, que prioriza a demonstração dos padrões arquiteturais
(SOLID, GoF, Clean Architecture). A decisão de adotar JWT está registrada
aqui como decisão arquitetural, a ser implementada em uma próxima iteração.

---

## Consequências da mudança

**Benefícios:**
- Sem estado no servidor — escala horizontalmente sem sessão compartilhada.
- Tokens auto-contidos — dispensa consulta ao banco por requisição autenticada.
- Compatível com o estilo de injeção de dependências manual do Express.

**Custos:**
- Revogar tokens antes do vencimento requer uma blocklist (não implementada
  no escopo deste trabalho).
- Tokens JWT não devem carregar dados sensíveis (são apenas Base64-encoded).
- Exige biblioteca de terceiros para assinar e verificar tokens (`jsonwebtoken`).

---

*Este ADR documenta uma decisão real revertida durante o desenvolvimento,
conforme recomendado pelo professor na orientação do trabalho.*
