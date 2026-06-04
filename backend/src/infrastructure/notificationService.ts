/**
 * Padrão GoF: Observer (Comportamento)
 *
 * Use cases publicam eventos. Observadores reagem de forma independente.
 * Adicionar novo canal de notificação não toca no código existente (OCP).
 *
 * NotificationService implementa INotificationService (interface do domínio) —
 * Clean Architecture: infraestrutura depende do domínio, nunca o contrário.
 */

import { Evento, INotificationService, NotificationObserver } from "../domain/notifications";

export class EmailObserver implements NotificationObserver {
  notificar(evento: Evento): void {
    const { agendamento } = evento;
    console.log(
      `[EMAIL] Para: ${agendamento.cliente.email} | ` +
      `Evento: ${evento.tipo} | ` +
      `Serviço: ${agendamento.servico.nome} em ` +
      `${agendamento.dataHora.toLocaleString("pt-BR")}`
    );
  }
}

export class SMSObserver implements NotificationObserver {
  notificar(evento: Evento): void {
    const { agendamento } = evento;
    console.log(
      `[SMS] Para: ${agendamento.cliente.telefone} | ` +
      `Evento: ${evento.tipo}`
    );
  }
}

export class NotificationService implements INotificationService {
  private observers: NotificationObserver[] = [];

  registrar(observer: NotificationObserver): void {
    this.observers.push(observer);
  }

  publicar(evento: Evento): void {
    for (const observer of this.observers) {
      observer.notificar(evento);
    }
  }
}