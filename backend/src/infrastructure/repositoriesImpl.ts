/**
 * Implementações concretas dos repositórios usando better-sqlite3.
 * Princípio aplicado: DIP — implementam interfaces do domínio.
 */

import Database from "better-sqlite3";
import path from "path";
import { Agendamento, Cliente, Profissional, Servico } from "../domain/entities";
import {
  AgendamentoRepository,
  ClienteRepository,
  ProfissionalRepository,
  ServicoRepository,
} from "../domain/repositories";

const DB_PATH = path.join(process.cwd(), "agendafacil.db");

export function createDatabase(): Database.Database {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS profissionais (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      especialidades TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      preco REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      profissional_id TEXT NOT NULL,
      servico_id TEXT NOT NULL,
      data_hora TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendente',
      observacoes TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (profissional_id) REFERENCES profissionais(id),
      FOREIGN KEY (servico_id) REFERENCES servicos(id)
    );
  `);

  return db;
}

export class SQLiteClienteRepository implements ClienteRepository {
  constructor(private readonly db: Database.Database) {}

  salvar(cliente: Cliente): Cliente {
    this.db.prepare(
      "INSERT INTO clientes (id, nome, telefone, email) VALUES (?, ?, ?, ?)"
    ).run(cliente.id, cliente.nome, cliente.telefone, cliente.email);
    return cliente;
  }

  buscarPorId(id: string): Cliente | undefined {
    const row = this.db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as any;
    return row ? new Cliente(row) : undefined;
  }

  buscarPorEmail(email: string): Cliente | undefined {
    const row = this.db.prepare("SELECT * FROM clientes WHERE email = ?").get(email) as any;
    return row ? new Cliente(row) : undefined;
  }

  listar(): Cliente[] {
    const rows = this.db.prepare("SELECT * FROM clientes").all() as any[];
    return rows.map((r) => new Cliente(r));
  }

  deletar(id: string): void {
    this.db.prepare("DELETE FROM agendamentos WHERE cliente_id = ?").run(id);
    this.db.prepare("DELETE FROM clientes WHERE id = ?").run(id);
  }
}

export class SQLiteProfissionalRepository implements ProfissionalRepository {
  constructor(private readonly db: Database.Database) {}

  salvar(profissional: Profissional): Profissional {
    this.db.prepare(
      "INSERT INTO profissionais (id, nome, especialidades) VALUES (?, ?, ?)"
    ).run(profissional.id, profissional.nome, JSON.stringify(profissional.especialidades));
    return profissional;
  }

  buscarPorId(id: string): Profissional | undefined {
    const row = this.db.prepare("SELECT * FROM profissionais WHERE id = ?").get(id) as any;
    if (!row) return undefined;
    return new Profissional({ ...row, especialidades: JSON.parse(row.especialidades) });
  }

  listar(): Profissional[] {
    const rows = this.db.prepare("SELECT * FROM profissionais").all() as any[];
    return rows.map((r) => new Profissional({ ...r, especialidades: JSON.parse(r.especialidades) }));
  }

  deletar(id: string): void {
    this.db.prepare("DELETE FROM agendamentos WHERE profissional_id = ?").run(id);
    this.db.prepare("DELETE FROM profissionais WHERE id = ?").run(id);
  }
}

export class SQLiteServicoRepository implements ServicoRepository {
  constructor(private readonly db: Database.Database) {}

  salvar(servico: Servico): Servico {
    this.db.prepare(
      "INSERT INTO servicos (id, nome, tipo, duracao_minutos, preco) VALUES (?, ?, ?, ?, ?)"
    ).run(servico.id, servico.nome, servico.tipo, servico.duracaoMinutos, servico.preco);
    return servico;
  }

  buscarPorId(id: string): Servico | undefined {
    const row = this.db.prepare("SELECT * FROM servicos WHERE id = ?").get(id) as any;
    return row ? new Servico({ ...row, duracaoMinutos: row.duracao_minutos }) : undefined;
  }

  listar(): Servico[] {
    const rows = this.db.prepare("SELECT * FROM servicos").all() as any[];
    return rows.map((r) => new Servico({ ...r, duracaoMinutos: r.duracao_minutos }));
  }

  deletar(id: string): void {
    this.db.prepare("DELETE FROM agendamentos WHERE servico_id = ?").run(id);
    this.db.prepare("DELETE FROM servicos WHERE id = ?").run(id);
  }
}

export class SQLiteAgendamentoRepository implements AgendamentoRepository {
  constructor(
    private readonly db: Database.Database,
    private readonly clienteRepo: SQLiteClienteRepository,
    private readonly profissionalRepo: SQLiteProfissionalRepository,
    private readonly servicoRepo: SQLiteServicoRepository
  ) {}

  salvar(agendamento: Agendamento): Agendamento {
    this.db.prepare(
      `INSERT INTO agendamentos (id, cliente_id, profissional_id, servico_id, data_hora, status, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      agendamento.id,
      agendamento.cliente.id,
      agendamento.profissional.id,
      agendamento.servico.id,
      agendamento.dataHora.toISOString(),
      agendamento.status,
      agendamento.observacoes ?? null
    );
    return agendamento;
  }

  buscarPorId(id: string): Agendamento | undefined {
    const row = this.db.prepare("SELECT * FROM agendamentos WHERE id = ?").get(id) as any;
    return row ? this.toEntity(row) : undefined;
  }

  listarPorProfissional(profissionalId: string, data: Date): Agendamento[] {
    const dataStr = data.toISOString().slice(0, 10);
    const rows = this.db.prepare(
      "SELECT * FROM agendamentos WHERE profissional_id = ? AND data_hora LIKE ?"
    ).all(profissionalId, `${dataStr}%`) as any[];
    return rows.map((r) => this.toEntity(r));
  }

  listarPorCliente(clienteId: string): Agendamento[] {
    const rows = this.db.prepare(
      "SELECT * FROM agendamentos WHERE cliente_id = ? ORDER BY data_hora DESC"
    ).all(clienteId) as any[];
    return rows.map((r) => this.toEntity(r));
  }

  listarTodos(): Agendamento[] {
    const rows = this.db.prepare(
      "SELECT * FROM agendamentos ORDER BY data_hora DESC"
    ).all() as any[];
    return rows.map((r) => this.toEntity(r));
  }

  atualizar(agendamento: Agendamento): Agendamento {
    this.db.prepare(
      "UPDATE agendamentos SET status = ?, observacoes = ? WHERE id = ?"
    ).run(agendamento.status, agendamento.observacoes ?? null, agendamento.id);
    return agendamento;
  }

  private toEntity(row: any): Agendamento {
    const cliente = this.clienteRepo.buscarPorId(row.cliente_id)!;
    const profissional = this.profissionalRepo.buscarPorId(row.profissional_id)!;
    const servico = this.servicoRepo.buscarPorId(row.servico_id)!;
    return new Agendamento({
      id: row.id,
      cliente,
      profissional,
      servico,
      dataHora: new Date(row.data_hora),
      observacoes: row.observacoes,
      statusInicial: row.status,
    });
  }
}
