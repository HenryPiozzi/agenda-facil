
 // Responsabilidade: receber HTTP, chamar use case, devolver resposta.
 

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createDatabase } from "../infrastructure/repositoriesImpl";
import {
  SQLiteClienteRepository,
  SQLiteProfissionalRepository,
  SQLiteServicoRepository,
  SQLiteAgendamentoRepository,
} from "../infrastructure/repositoriesImpl";
import { NotificationService, EmailObserver, SMSObserver } from "../infrastructure/notificationService";
import {
  CriarClienteUseCase,
  CriarServicoUseCase,
  CriarProfissionalUseCase,
  CriarAgendamentoUseCase,
  ConfirmarAgendamentoUseCase,
  CancelarAgendamentoUseCase,
  ListarAgendamentosUseCase,
  ListarClientesUseCase,
  ListarProfissionaisUseCase,
  ListarServicosUseCase,
} from "../application/useCases";

// ── Setup ─────────────────────────────────────────────────────────────────────

const db = createDatabase();
const clienteRepo = new SQLiteClienteRepository(db);
const profissionalRepo = new SQLiteProfissionalRepository(db);
const servicoRepo = new SQLiteServicoRepository(db);
const agendamentoRepo = new SQLiteAgendamentoRepository(db, clienteRepo, profissionalRepo, servicoRepo);

const notification = new NotificationService();
notification.registrar(new EmailObserver());
notification.registrar(new SMSObserver());

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// ── Helpers ───────────────────────────────────────────────────────────────────

function tryCatch(fn: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try { fn(req, res); } catch (e: any) { res.status(400).json({ erro: e.message }); }
  };
}

// ── Clientes ──────────────────────────────────────────────────────────────────

app.get("/api/clientes", tryCatch((req, res) => {
  const uc = new ListarClientesUseCase(clienteRepo);
  res.json(uc.executar());
}));

app.post("/api/clientes", tryCatch((req, res) => {
  const uc = new CriarClienteUseCase(clienteRepo);
  const cliente = uc.executar(req.body);
  res.status(201).json(cliente);
}));

// ── Serviços ──────────────────────────────────────────────────────────────────

app.get("/api/servicos", tryCatch((req, res) => {
  const uc = new ListarServicosUseCase(servicoRepo);
  res.json(uc.executar());
}));

app.post("/api/servicos", tryCatch((req, res) => {
  const uc = new CriarServicoUseCase(servicoRepo);
  const servico = uc.executar(req.body);
  res.status(201).json(servico);
}));

// ── Profissionais ─────────────────────────────────────────────────────────────

app.get("/api/profissionais", tryCatch((req, res) => {
  const uc = new ListarProfissionaisUseCase(profissionalRepo);
  res.json(uc.executar());
}));

app.post("/api/profissionais", tryCatch((req, res) => {
  const uc = new CriarProfissionalUseCase(profissionalRepo);
  const profissional = uc.executar(req.body);
  res.status(201).json(profissional);
}));

// ── Agendamentos ──────────────────────────────────────────────────────────────

app.get("/api/agendamentos", tryCatch((req, res) => {
  const uc = new ListarAgendamentosUseCase(agendamentoRepo);
  res.json(uc.executar());
}));

app.post("/api/agendamentos", tryCatch((req, res) => {
  const uc = new CriarAgendamentoUseCase(
    agendamentoRepo, clienteRepo, profissionalRepo, servicoRepo, notification
  );
  const { clienteId, profissionalId, servicoId, dataHora, observacoes } = req.body;
  const agendamento = uc.executar({
    clienteId,
    profissionalId,
    servicoId,
    dataHora: new Date(dataHora),
    observacoes,
  });
  res.status(201).json(agendamento);
}));

app.patch("/api/agendamentos/:id/confirmar", tryCatch((req, res) => {
  const uc = new ConfirmarAgendamentoUseCase(agendamentoRepo, notification);
  res.json(uc.executar(req.params.id));
}));

app.patch("/api/agendamentos/:id/cancelar", tryCatch((req, res) => {
  const uc = new CancelarAgendamentoUseCase(agendamentoRepo, notification);
  res.json(uc.executar(req.params.id));
}));

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`\n AgendaFácil rodando em http://localhost:${PORT}`);
  console.log(` API disponível em http://localhost:${PORT}/api`);
  console.log(` Frontend em http://localhost:${PORT}\n`);
});

export default app;
