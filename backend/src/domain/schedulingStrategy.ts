/**
 * Padrão GoF: Strategy (Comportamento)
 *
 * Permite trocar o algoritmo de verificação de disponibilidade
 * sem alterar o código que o usa. OCP aplicado.
 */

import { Agendamento, Servico } from "./entities";

export interface DisponibilidadeStrategy {
  verificar(
    agendamentosExistentes: Agendamento[],
    dataHoraPretendida: Date,
    servico: Servico
  ): boolean;
}

export class DisponibilidadePorIntervalo implements DisponibilidadeStrategy {
  constructor(private readonly intervaloMinutos: number = 30) {}

  verificar(
    agendamentosExistentes: Agendamento[],
    dataHoraPretendida: Date,
    servico: Servico
  ): boolean {
    const minuto = dataHoraPretendida.getMinutes();
    if (minuto % this.intervaloMinutos !== 0) return false;

    const fimPretendido = new Date(
      dataHoraPretendida.getTime() + servico.duracaoMinutos * 60000
    );

    for (const agendamento of agendamentosExistentes) {
      if (agendamento.status === "cancelado") continue;
      const inicioExistente = agendamento.dataHora;
      const fimExistente = new Date(
        inicioExistente.getTime() + agendamento.servico.duracaoMinutos * 60000
      );
      if (dataHoraPretendida < fimExistente && fimPretendido > inicioExistente) {
        return false;
      }
    }
    return true;
  }
}

export class DisponibilidadePorHoraCheia implements DisponibilidadeStrategy {
  verificar(
    agendamentosExistentes: Agendamento[],
    dataHoraPretendida: Date,
    servico: Servico
  ): boolean {
    if (dataHoraPretendida.getMinutes() !== 0) return false;

    const fimPretendido = new Date(
      dataHoraPretendida.getTime() + servico.duracaoMinutos * 60000
    );

    for (const agendamento of agendamentosExistentes) {
      if (agendamento.status === "cancelado") continue;
      const inicioExistente = agendamento.dataHora;
      const fimExistente = new Date(
        inicioExistente.getTime() + agendamento.servico.duracaoMinutos * 60000
      );
      if (dataHoraPretendida < fimExistente && fimPretendido > inicioExistente) {
        return false;
      }
    }
    return true;
  }
}
