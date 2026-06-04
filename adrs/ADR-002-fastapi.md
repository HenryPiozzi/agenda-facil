# ADR-002: Adotar FastAPI como framework web

**Status:** Superseded por ADR-002-express.md

---

## Contexto

O sistema precisa expor uma API REST. As alternativas avaliadas foram:

| Framework | Prós | Contras |
|-----------|------|---------|
| **Flask** | Simples, amplo histórico | Sem tipagem nativa, OpenAPI manual |
| **Django REST** | Completo, admin embutido | Pesado para um projeto de escopo reduzido |
| **FastAPI** | Tipagem, OpenAPI automático, injeção de dependências | Mais recente, menor base de tutoriais antigos |

O atributo de qualidade **manutenibilidade** foi priorizado: queremos que
a documentação da API esteja sempre sincronizada com o código, sem esforço
manual. FastAPI gera o schema OpenAPI 3.x automaticamente a partir dos
type hints do Python e dos schemas Pydantic.

---

## Decisão

Adotamos **FastAPI** como framework web da aplicação.

---

## Consequências

**Benefícios:**
- Geração automática de documentação interativa (Swagger UI em `/docs`).
- Sistema nativo de injeção de dependências que suporta o princípio DIP.
- Validação de dados integrada via Pydantic, eliminando código de validação manual.
- Performance superior ao Flask por usar ASGI (Starlette) internamente.

**Custos:**
- Exige familiaridade com `async/await` para uso pleno (usamos modo síncrono
  no projeto para simplificar).
- Pydantic v2 tem sintaxe diferente da v1 — requer atenção na documentação.
