/**
 * Padrão GoF: Factory Method (Criação)
 *
 * Centraliza a criação de Servico com duração padrão por tipo.
 * Adicionar novo tipo = nova factory, sem alterar código existente (OCP).
 */

import { Servico, TipoServico } from "./entities";
import { v4 as uuidv4 } from "uuid";

export interface ServicoFactory {
  create(nome: string, preco: number): Servico;
}

export class CorteFactory implements ServicoFactory {
  create(nome: string, preco: number): Servico {
    return new Servico({ id: uuidv4(), nome, tipo: "corte", duracaoMinutos: 30, preco });
  }
}

export class BarbaFactory implements ServicoFactory {
  create(nome: string, preco: number): Servico {
    return new Servico({ id: uuidv4(), nome, tipo: "barba", duracaoMinutos: 20, preco });
  }
}

export class CorteEBarbaFactory implements ServicoFactory {
  create(nome: string, preco: number): Servico {
    return new Servico({ id: uuidv4(), nome, tipo: "corte_e_barba", duracaoMinutos: 45, preco });
  }
}

export class TratamentoFactory implements ServicoFactory {
  create(nome: string, preco: number): Servico {
    return new Servico({ id: uuidv4(), nome, tipo: "tratamento", duracaoMinutos: 60, preco });
  }
}

const factories: Record<TipoServico, ServicoFactory> = {
  corte: new CorteFactory(),
  barba: new BarbaFactory(),
  corte_e_barba: new CorteEBarbaFactory(),
  tratamento: new TratamentoFactory(),
};

export function getFactory(tipo: TipoServico): ServicoFactory {
  return factories[tipo];
}
