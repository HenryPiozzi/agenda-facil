# ADR-005: Estratégia de autenticação

**Status:** Accepted (decisão atual — implementação planejada para próxima iteração)

---

## Contexto

Durante a Semana 1, o grupo decidiu implementar autenticação via **sessão
em cookie** (server-side session), seguindo o padrão clássico de aplicações
web.

Na Semana 2, ao iniciar a implementação, identificamos dois problemas que
motivaram a reversão:

1. **Incompatibilidade com o estilo API-first**: sessões server-side exigem
   estado no servidor, contradizendo o princípio REST de statelessness. No
   Express, sessões exigem middleware adicional (`express-session`) com
   armazenamento persistente (Redis ou banco), aumentando a complexidade
   sem benefício claro para o escopo do projeto.

2. **Dificuldade de teste**: testes de integração com sessões exigiriam
   gerenciar cookies manualmente no cliente de teste, complicando os casos
   de teste sem agregar valor à demonstração dos padrões arquiteturais.

---

## Decisão original (revertida)

~~Usar sessão em cookie com `express-session` para autenticação.~~

---

## Decisão atual

Adotar **autenticação via JWT (JSON Web Token)** em uma versão de produção
do sistema. O token seria enviado no header `Authorization: Bearer <token>`
e validado por middleware Express na camada de API.

A implementação de autenticação está fora do escopo deste trabalho, que
prioriza a demonstração dos padrões arquiteturais. Esta decisão está
registrada como arquitetural, a ser implementada em próxima iteração.

---

## Consequências

**Benefícios:**
- Stateless — alinhado com REST e com os princípios da Clean Architecture.
- Testável: o token é uma string simples, fácil de incluir em testes.
- Escala horizontalmente sem sessão compartilhada entre instâncias.
- Alinha-se ao DIP: o middleware de autenticação pode ser injetado como
  dependência na camada de API sem tocar no domínio.

**Custos:**
- Revogar tokens antes do vencimento requer uma blocklist no servidor.
- Tokens JWT são apenas Base64-encoded — não devem carregar dados sensíveis.
- Exige biblioteca de terceiros para assinar e verificar tokens (`jsonwebtoken`).

---

*Este ADR documenta uma decisão real revertida durante o desenvolvimento,
conforme recomendado pelo professor na orientação do trabalho.*
