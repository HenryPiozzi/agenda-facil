/**
 * Camada de Aplicação — Casos de Uso.
 * SRP: cada classe tem exatamente uma razão para mudar.
 */

import { v4 as uuidv4 } from "uuid";
import { Agendamento, Cliente, Profissional, Servico, TipoServico } from "../domain/entities";
import {
  AgendamentoRepository,
  ClienteRepository,
  ProfissionalRepository,
  ServicoRepository,
} from "../domain/repositories";
import { DisponibilidadeStrategy, DisponibilidadePorIntervalo } from "../domain/schedulingStrategy";
import { INotificationService } from "../domain/notifications";
import { getFactory } from "../domain/factories";

export class CriarClienteUseCase {
  constructor(private readonly repo: ClienteRepository) {}

  executar(params: { nome: string; telefone: string; email: string }): Cliente {
    if (this.repo.buscarPorEmail(params.email)) {
      throw new Error(`Já existe um cliente com o e-mail ${params.email}.`);
    }
    const cliente = new Cliente({ id: uuidv4(), ...params });
    return this.repo.salvar(cliente);
  }
}

export class CriarServicoUseCase {
  constructor(private readonly repo: ServicoRepository) {}

  executar(params: {
    nome: string;
    tipo: TipoServico;
    duracaoMinutos: number;
    preco: number;
  }): Servico {
    const servico = getFactory(params.tipo).create(params.nome, params.preco);
    return this.repo.salvar(servico);
  }
}

export class CriarProfissionalUseCase {
  constructor(private readonly repo: ProfissionalRepository) {}

  executar(params: { nome: string; especialidades: TipoServico[] }): Profissional {
    const profissional = new Profissional({ id: uuidv4(), ...params });
    return this.repo.salvar(profissional);
  }
}

export class CriarAgendamentoUseCase {
  private readonly estrategia: DisponibilidadeStrategy;

  constructor(
    private readonly agendamentoRepo: AgendamentoRepository,
    private readonly clienteRepo: ClienteRepository,
    private readonly profissionalRepo: ProfissionalRepository,
    private readonly servicoRepo: ServicoRepository,
    private readonly notification: INotificationService,
    estrategia?: DisponibilidadeStrategy
  ) {
    this.estrategia = estrategia ?? new DisponibilidadePorIntervalo(30);
  }

  executar(params: {
    clienteId: string;
    profissionalId: string;
    servicoId: string;
    dataHora: Date;
    observacoes?: string;
  }): Agendamento {
    const cliente = this.clienteRepo.buscarPorId(params.clienteId);
    if (!cliente) throw new Error(`Cliente ${params.clienteId} não encontrado.`);

    const profissional = this.profissionalRepo.buscarPorId(params.profissionalId);
    if (!profissional) throw new Error(`Profissional ${params.profissionalId} não encontrado.`);

    const servico = this.servicoRepo.buscarPorId(params.servicoId);
    if (!servico) throw new Error(`Serviço ${params.servicoId} não encontrado.`);

    const agendamentosExistentes = this.agendamentoRepo.listarPorProfissional(
      params.profissionalId,
      params.dataHora
    );

    if (!this.estrategia.verificar(agendamentosExistentes, params.dataHora, servico)) {
      throw new Error(`Horário indisponível para ${profissional.nome}.`);
    }

    const agendamento = new Agendamento({ id: uuidv4(), cliente, profissional, servico, ...params });
    this.agendamentoRepo.salvar(agendamento);
    this.notification.publicar({ tipo: "agendamento_criado", agendamento });
    return agendamento;
  }
}

export class ConfirmarAgendamentoUseCase {
  constructor(
    private readonly repo: AgendamentoRepository,
    private readonly notification: INotificationService
  ) {}

  executar(agendamentoId: string): Agendamento {
    const agendamento = this.repo.buscarPorId(agendamentoId);
    if (!agendamento) throw new Error(`Agendamento ${agendamentoId} não encontrado.`);
    agendamento.confirmar();
    this.repo.atualizar(agendamento);
    this.notification.publicar({ tipo: "agendamento_confirmado", agendamento });
    return agendamento;
  }
}

export class CancelarAgendamentoUseCase {
  constructor(
    private readonly repo: AgendamentoRepository,
    private readonly notification: INotificationService
  ) {}

  executar(agendamentoId: string): Agendamento {
    const agendamento = this.repo.buscarPorId(agendamentoId);
    if (!agendamento) throw new Error(`Agendamento ${agendamentoId} não encontrado.`);
    agendamento.cancelar();
    this.repo.atualizar(agendamento);
    this.notification.publicar({ tipo: "agendamento_cancelado", agendamento });
    return agendamento;
  }
}

export class ListarAgendamentosUseCase {
  constructor(private readonly repo: AgendamentoRepository) {}

  executar(): Agendamento[] {
    return this.repo.listarTodos();
  }
}

export class ListarClientesUseCase {
  constructor(private readonly repo: ClienteRepository) {}
  executar(): Cliente[] { return this.repo.listar(); }
}

export class ListarProfissionaisUseCase {
  constructor(private readonly repo: ProfissionalRepository) {}
  executar(): Profissional[] { return this.repo.listar(); }
}

export class ListarServicosUseCase {
  constructor(private readonly repo: ServicoRepository) {}
  executar(): Servico[] { return this.repo.listar(); }
}
