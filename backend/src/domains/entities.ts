/**
 * Camada de Domínio — Entidades e regras de negócio puras.
 *
 * Não importa nada de infraestrutura (banco, HTTP, etc.).
 * Princípio aplicado: Inversão de Dependência (DIP).
 */

export type StatusAgendamento = "pendente" | "confirmado" | "cancelado" | "concluido";
export type TipoServico = "corte" | "barba" | "corte_e_barba" | "tratamento";

// ── Cliente ──────────────────────────────────────────────────────────────────

export class Cliente {
  readonly id: string;
  readonly nome: string;
  readonly telefone: string;
  readonly email: string;

  constructor(params: { id: string; nome: string; telefone: string; email: string }) {
    this.validarEmail(params.email);
    this.validarTelefone(params.telefone);
    this.id = params.id;
    this.nome = params.nome;
    this.telefone = params.telefone;
    this.email = params.email;
  }

  private validarEmail(email: string): void {
    if (!email.includes("@")) {
      throw new Error(`E-mail inválido: ${email}`);
    }
  }

  private validarTelefone(telefone: string): void {
    const digitos = telefone.replace(/\D/g, "");
    if (digitos.length < 10) {
      throw new Error(`Telefone inválido: ${telefone}`);
    }
  }
}

// ── Serviço ───────────────────────────────────────────────────────────────────

export class Servico {
  readonly id: string;
  readonly nome: string;
  readonly tipo: TipoServico;
  readonly duracaoMinutos: number;
  readonly preco: number;

  constructor(params: {
    id: string;
    nome: string;
    tipo: TipoServico;
    duracaoMinutos: number;
    preco: number;
  }) {
    if (params.duracaoMinutos <= 0) throw new Error("Duração deve ser positiva.");
    if (params.preco < 0) throw new Error("Preço não pode ser negativo.");
    this.id = params.id;
    this.nome = params.nome;
    this.tipo = params.tipo;
    this.duracaoMinutos = params.duracaoMinutos;
    this.preco = params.preco;
  }
}

// ── Profissional ──────────────────────────────────────────────────────────────

export class Profissional {
  readonly id: string;
  readonly nome: string;
  readonly especialidades: TipoServico[];

  constructor(params: { id: string; nome: string; especialidades: TipoServico[] }) {
    this.id = params.id;
    this.nome = params.nome;
    this.especialidades = params.especialidades;
  }

  atende(tipo: TipoServico): boolean {
    return this.especialidades.includes(tipo);
  }
}

// ── Agendamento ───────────────────────────────────────────────────────────────

export class Agendamento {
  readonly id: string;
  readonly cliente: Cliente;
  readonly profissional: Profissional;
  readonly servico: Servico;
  readonly dataHora: Date;
  readonly observacoes?: string;
  private _status: StatusAgendamento;

  constructor(params: {
    id: string;
    cliente: Cliente;
    profissional: Profissional;
    servico: Servico;
    dataHora: Date;
    observacoes?: string;
    // Usado apenas para hidratação a partir do banco; novos agendamentos sempre começam como "pendente".
    statusInicial?: StatusAgendamento;
  }) {
    if (!params.profissional.atende(params.servico.tipo)) {
      throw new Error(
        `${params.profissional.nome} não atende ${params.servico.tipo}.`
      );
    }
    this.id = params.id;
    this.cliente = params.cliente;
    this.profissional = params.profissional;
    this.servico = params.servico;
    this.dataHora = params.dataHora;
    this.observacoes = params.observacoes;
    this._status = params.statusInicial ?? "pendente";
  }

  get status(): StatusAgendamento {
    return this._status;
  }

  toJSON() {
    return {
      id: this.id,
      cliente: this.cliente,
      profissional: this.profissional,
      servico: this.servico,
      dataHora: this.dataHora,
      status: this._status,
      observacoes: this.observacoes,
    };
  }

  confirmar(): void {
    if (this._status !== "pendente") {
      throw new Error(`Só é possível confirmar agendamentos pendentes. Status atual: ${this._status}`);
    }
    this._status = "confirmado";
  }

  cancelar(): void {
    if (this._status === "concluido") {
      throw new Error("Não é possível cancelar um agendamento já concluído.");
    }
    this._status = "cancelado";
  }

  concluir(): void {
    if (this._status !== "confirmado") {
      throw new Error(`Só é possível concluir agendamentos confirmados. Status atual: ${this._status}`);
    }
    this._status = "concluido";
  }
}
