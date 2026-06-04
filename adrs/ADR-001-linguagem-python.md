# ADR-001: Adotar Python como linguagem principal

**Status:** Superseded por ADR-001-linguagem-typescript.md

---

## Contexto

O grupo é composto por 5 integrantes com experiência predominante em Python,
adquirida ao longo do curso. O prazo de desenvolvimento é de aproximadamente
3 semanas, o que torna inviável uma curva de aprendizado significativa em
uma nova linguagem. O sistema a ser desenvolvido é uma API backend sem
requisitos de performance extrema que justificassem linguagens compiladas
como Go ou Java.

---

## Decisão

Adotamos **Python 3.11+** como linguagem única do projeto.

---

## Consequências

**Benefícios:**
- Curva de aprendizado zero para todos os integrantes.
- Ecossistema maduro para desenvolvimento de APIs (FastAPI, SQLAlchemy).
- Sintaxe expressiva que favorece código limpo e legível.
- Suporte nativo a tipagem estática com `typing` e `dataclasses`.
- Ferramentas de teste bem estabelecidas (pytest).

**Custos:**
- Performance inferior a linguagens compiladas em cenários de alta concorrência.
- GIL (Global Interpreter Lock) pode ser limitante sob carga muito alta —
  aceitável para o escopo do projeto.
- Tipagem dinâmica exige disciplina para manter type hints atualizados.
