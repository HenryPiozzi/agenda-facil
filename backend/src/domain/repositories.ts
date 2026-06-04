/**
 * Interfaces abstratas dos repositórios
**/

import { Agendamento, Cliente, Profissional, Servico } from "./entities";

export interface ClienteRepository {
  salvar(cliente: Cliente): Cliente;
  buscarPorId(id: string): Cliente | undefined;
  buscarPorEmail(email: string): Cliente | undefined;
  listar(): Cliente[];
}

export interface ProfissionalRepository {
  salvar(profissional: Profissional): Profissional;
  buscarPorId(id: string): Profissional | undefined;
  listar(): Profissional[];
}

export interface ServicoRepository {
  salvar(servico: Servico): Servico;
  buscarPorId(id: string): Servico | undefined;
  listar(): Servico[];
}

export interface AgendamentoRepository {
  salvar(agendamento: Agendamento): Agendamento;
  buscarPorId(id: string): Agendamento | undefined;
  listarPorProfissional(profissionalId: string, data: Date): Agendamento[];
  listarPorCliente(clienteId: string): Agendamento[];
  atualizar(agendamento: Agendamento): Agendamento;
  listarTodos(): Agendamento[];
}
