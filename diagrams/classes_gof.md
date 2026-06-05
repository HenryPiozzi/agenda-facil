```mermaid
classDiagram
    %% ── FACTORY METHOD (factories.ts) ───────────────────────────────────────
    class ServicoFactory {
        <<interface>>
        +create(nome: string, preco: number) Servico
    }
    class CorteFactory {
        +create(nome: string, preco: number) Servico
    }
    class BarbaFactory {
        +create(nome: string, preco: number) Servico
    }
    class CorteEBarbaFactory {
        +create(nome: string, preco: number) Servico
    }
    class TratamentoFactory {
        +create(nome: string, preco: number) Servico
    }
    ServicoFactory <|-- CorteFactory
    ServicoFactory <|-- BarbaFactory
    ServicoFactory <|-- CorteEBarbaFactory
    ServicoFactory <|-- TratamentoFactory

    %% ── STRATEGY (schedulingStrategy.ts) ───────────────────────────────────
    class DisponibilidadeStrategy {
        <<interface>>
        +verificar(agendamentos: Agendamento[], dataHora: Date, servico: Servico) boolean
    }
    class DisponibilidadePorHoraCheia {
        +verificar(agendamentos: Agendamento[], dataHora: Date, servico: Servico) boolean
    }
    class DisponibilidadePorIntervalo {
        -intervaloMinutos: number
        +verificar(agendamentos: Agendamento[], dataHora: Date, servico: Servico) boolean
    }
    class CriarAgendamentoUseCase {
        -estrategia: DisponibilidadeStrategy
        +executar(params) Agendamento
    }
    DisponibilidadeStrategy <|-- DisponibilidadePorHoraCheia
    DisponibilidadeStrategy <|-- DisponibilidadePorIntervalo
    CriarAgendamentoUseCase o-- DisponibilidadeStrategy

    %% ── OBSERVER (notificationService.ts) ──────────────────────────────────
    class NotificationObserver {
        <<interface>>
        +notificar(evento: Evento) void
    }
    class EmailObserver {
        +notificar(evento: Evento) void
    }
    class SMSObserver {
        +notificar(evento: Evento) void
    }
    class NotificationService {
        -observers: NotificationObserver[]
        +registrar(observer: NotificationObserver) void
        +publicar(evento: Evento) void
    }
    NotificationObserver <|-- EmailObserver
    NotificationObserver <|-- SMSObserver
    NotificationService o-- NotificationObserver

    %% ── ADAPTER (repositoriesImpl.ts) ──────────────────────────────────────
    %% Target: interfaces de repositório do domínio
    %% Adaptee: linha plana SQLite (snake_case, primitivos, JSON como string)
    %% Adapter: implementações SQLite com toEntity() que converte os formatos
    class ClienteRepository {
        <<interface>>
        +salvar(cliente: Cliente) Cliente
        +buscarPorId(id: string) Cliente
        +buscarPorEmail(email: string) Cliente
        +listar() Cliente[]
        +deletar(id: string) void
    }
    class SQLiteClienteRepository {
        -db: Database
        +salvar(cliente: Cliente) Cliente
        +buscarPorId(id: string) Cliente
        +buscarPorEmail(email: string) Cliente
        +listar() Cliente[]
        +deletar(id: string) void
        -toEntity(row: SQLiteRow) Cliente
    }
    ClienteRepository <|-- SQLiteClienteRepository

    class ServicoRepository {
        <<interface>>
        +salvar(servico: Servico) Servico
        +buscarPorId(id: string) Servico
        +listar() Servico[]
        +deletar(id: string) void
    }
    class SQLiteServicoRepository {
        -db: Database
        +salvar(servico: Servico) Servico
        +buscarPorId(id: string) Servico
        +listar() Servico[]
        +deletar(id: string) void
        -toEntity(row: SQLiteRow) Servico
    }
    ServicoRepository <|-- SQLiteServicoRepository

    class AgendamentoRepository {
        <<interface>>
        +salvar(agendamento: Agendamento) Agendamento
        +buscarPorId(id: string) Agendamento
        +listarPorProfissional(profId: string, data: Date) Agendamento[]
        +atualizar(agendamento: Agendamento) Agendamento
        +listarTodos() Agendamento[]
    }
    class SQLiteAgendamentoRepository {
        -db: Database
        +salvar(agendamento: Agendamento) Agendamento
        +buscarPorId(id: string) Agendamento
        +listarPorProfissional(profId: string, data: Date) Agendamento[]
        +atualizar(agendamento: Agendamento) Agendamento
        +listarTodos() Agendamento[]
        -toEntity(row: SQLiteRow) Agendamento
    }
    AgendamentoRepository <|-- SQLiteAgendamentoRepository
    CriarAgendamentoUseCase o-- AgendamentoRepository
```
