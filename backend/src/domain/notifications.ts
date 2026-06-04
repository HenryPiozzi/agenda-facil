/**
 * Contratos de notificação definidos no domínio.
 * A camada de aplicação depende dessas interfaces, não das implementações concretas.
 * Princípio aplicado: Inversão de Dependência (DIP).
 */

import { Agendamento } from "./entities";

export type TipoEvento =
  | "agendamento_criado"
  | "agendamento_confirmado"
  | "agendamento_cancelado"
  | "agendamento_concluido";

export interface Evento {
  tipo: TipoEvento;
  agendamento: Agendamento;
}

export interface NotificationObserver {
  notificar(evento: Evento): void;
}

export interface INotificationService {
  registrar(observer: NotificationObserver): void;
  publicar(evento: Evento): void;
}
