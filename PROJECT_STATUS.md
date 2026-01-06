# AgendaZap — Contexto e Progresso do Projeto

## 📌 Visão Geral
O **AgendaZap** é um micro-SaaS educacional de **agendamento automatizado**, desenvolvido com foco em **aprendizado profundo**, **boas práticas modernas** e **valor de portfólio**.

O projeto foi construído **do zero**, passo a passo, com decisões conscientes para evitar overengineering e maximizar entendimento técnico.

Este documento serve como:
- Contexto rápido para o desenvolvedor
- Base de entendimento para agentes de IA
- Registro de decisões arquiteturais
- Snapshot do estado atual do projeto

---

## 🎯 Objetivo do Projeto
Permitir que pequenos negócios (barbearias, salões, estúdios, etc.):

- Criem e gerenciem uma agenda
- Evitem conflitos de horário
- Utilizem um painel web simples
- No futuro, integrem agendamentos via WhatsApp

> **Escopo atual:** MVP funcional e didático (sem escala comercial).

---

## 🧱 Stack Tecnológica
### Backend
- ASP.NET Web API (.NET 10)
- Minimal APIs
- Entity Framework Core
- PostgreSQL
- Docker

### Frontend
- Angular 19
- Standalone Components
- Reactive Forms
- HttpClient

### Infra
- Docker + Docker Compose
- PostgreSQL containerizado
- Adminer para inspeção do banco

---

## 🧠 Princípios Arquiteturais
- Backend é a **fonte da verdade**
- Regras de negócio **nunca** ficam no frontend
- Datas são armazenadas em **UTC**
- Frontend converte para horário local
- DTOs separam API ↔ Banco
- Nada de overengineering prematuro

---

## 🚀 Progresso por Sprints

---

### ✅ Sprint 0 — Setup do Projeto
- Estrutura de pastas definida
- Repositório GitHub criado (público)
- `.gitignore` configurado corretamente
- `.env.example` adicionado
- README profissional criado

---

### ✅ Sprint 1 — Dockerização
- PostgreSQL rodando via Docker
- Adminer disponível para inspeção
- API ASP.NET dockerizada
- Porta configurada corretamente
- Endpoint `/health` funcional

---

### ✅ Sprint 2 — Banco de Dados
- Entity Framework Core configurado
- DbContext criado
- Primeira entidade: `Appointment`
- Migrations criadas e aplicadas
- Banco validado via Adminer

---

### ✅ Sprint 3 — Regra de Agendamento
- Endpoint `POST /appointments`
- DTO de criação separado da entidade
- Validação de conflito de horário
- Regra correta de sobreposição
- Tratamento de erro `409 Conflict`

---

### ✅ Sprint 4 — Listagem de Agenda
- Endpoint `GET /appointments?date=YYYY-MM-DD`
- DTO de resposta criado
- Filtro por dia (UTC)
- Ordenação por horário
- Base para painel e WhatsApp

---

### ✅ Sprint 5 — Integração Angular
- Angular 19 configurado com `app.config.ts`
- HttpClient habilitado corretamente
- Service de agenda criado
- Componente de agenda diária
- Conversão UTC → horário local
- CORS configurado no backend

---

### ✅ Sprint 6 — Criar Agendamento pelo Painel
- Reactive Forms implementado
- Validação de campos
- POST via Angular
- Tratamento de conflito no frontend
- Atualização automática da agenda

---

### ✅ Sprint 7 — Melhoria Visual
- Layout em cards
- Separação clara: formulário vs agenda
- Estilo limpo (CSS puro)
- UX básica profissional

---

### ✅ Sprint 8 — Editar e Cancelar Agendamentos
- Endpoint `PUT /appointments/{id}`
- Endpoint `DELETE /appointments/{id}`
- Regra de conflito ao editar (ignorando o próprio)
- Reuso do formulário para edição
- Estado de edição controlado no Angular

---

### ✅ Sprint 9 — Modal de Confirmação
- Modal customizado (sem `confirm()`)
- Exibição de nome e horário
- Confirmação consciente de cancelamento
- UX mais segura e profissional

---

## 📦 Funcionalidades Atuais (Resumo)
✔ Criar agendamentos  
✔ Editar agendamentos  
✔ Cancelar agendamentos  
✔ Listar agenda diária  
✔ Evitar conflitos de horário  
✔ Painel web funcional  
✔ Backend robusto e validado  

---

## ⚠️ Decisões Importantes Tomadas
- Telefones são retornados no GET **apenas para painel**
- Datas sempre em UTC no backend
- Sem autenticação ainda (fora do escopo MVP)
- Exclusão física (DELETE) por simplicidade
- Sem IA controlando regra de negócio

---

## 🧭 Próximas Sprints Possíveis
- Bloquear horários fixos (almoço / pausa)
- Agenda semanal
- Integração com WhatsApp (webhook)
- Separação Services / Repositories no backend
- Autenticação básica
- Refino de UX

---

## 🧠 Estado Atual do Projeto
> **MVP funcional, coerente e com alto valor educacional.**

O projeto já demonstra:
- Full-stack real (.NET + Angular)
- Integração com banco
- Regras de negócio sólidas
- UX básica utilizável
- Infra containerizada

Pronto para evoluir para:
- funcionalidades mais complexas de agenda
- integrações externas (WhatsApp + IA)

---

## 👨‍💻 Autor
Desenvolvido por **Juan Mendes Peixoto**  
Foco em aprendizado, portfólio e maturidade técnica.
