<<<<<<< HEAD
# sirene-cozinhas-GAMT
=======
# Sirene Cozinha (GAMT)

> **Objetivo (GAMT):** reduzir deslocamentos e perda de tempo. Em vez de “ficar andando pelo local” para avisar o que está faltando, o processo vira um fluxo organizado: quem percebe a falta envia um pedido e a **cozinha monitora** com alertas.

---

## ✨ O que é este projeto?

Um sistema simples de **monitoramento de pedidos** entre duas telas:

- **Barracão (envio)**: registra **Produto/Item** e **Setor de Destino**.
- **Cozinha (monitor)**: lista os pedidos **pendentes** e faz alerta **sonoro + TTS** (fala) para chamar atenção imediata.
- Quando o item é atendido, a cozinha marca como **Concluído**.

A persistência dos dados é feita em **Google Sheets**, com lógica no **Google Apps Script**.

---

## 🧠 Motivação (GAMT)

Este projeto foi criado em uma empresa para suportar um problema bem comum na rotina:

- alguém percebe que falta algo;
- ao invés de resolver na hora, começa a **andar pelo local** procurando quem precisa ver;
- isso gera **interrupções, atraso e desperdício de tempo**.

Com o GAMT, o pedido deixa de ser “uma conversa andando” e vira **um evento** no sistema.

---

## 🏗️ Arquitetura

### Front-end (HTML + JavaScript)
- `Barracao.html`: tela de envio do pedido.
- `Cozinha.html`: tela de monitor com:
  - **audio gate** (o monitor só inicia após clique)
  - polling a cada 5s
  - reprodução de som + fala com `speechSynthesis`

### Back-end (Google Apps Script)
- `Code.gs`: API + páginas.
- Regras de status na planilha:
  - `Pendente`
  - `Concluído`

### Banco de dados
- **Google Sheets** (aba `Alertas`)

---

## 🔄 Fluxo do Sistema

### 1) Barracão envia um pedido
1. Preenche:
   - **Produto / Item**
   - **Setor de Destino**
2. Clica **ENVIAR PEDIDO**.
3. O front chama `google.script.run.enviarAlerta(item, setor)`.
4. O Apps Script grava uma linha na planilha com status `Pendente`.

### 2) Cozinha monitora e alerta
1. Usuário clica **ATIVAR MONITOR**.
2. A tela começa polling com `buscarNovosAlertas()` a cada **5 segundos**.
3. Para cada pendente, o sistema:
   - renderiza um card com horário, item e setor
   - se for um alerta “novo”, toca som e faz a fala:
     - **“Atenção: Faltando {item} do {setor}”**

### 3) Concluir
- Botão **MARCAR CONCLUÍDO** chama `concluirAlerta(id)`.
- A linha na planilha passa para `Concluído` e some da lista de pendentes.

---

## 🗂️ Estrutura do `Code.gs`

### Roteamento via `doGet(e)`
O `doGet(e)` faz duas coisas:

1. **Serve páginas** (quando não existe `action`):
   - `?p=barracao` (default)
   - `?p=cozinha`

2. **Serve API JSON** (quando existe `action`):
   - `?action=enviar&item=...&setor=...`
   - `?action=buscar`
   - `?action=concluir&id=...`

### Funções principais
- `enviarAlerta(item, setor)`
- `buscarNovosAlertas()`
- `concluirAlerta(id)`

---

## 📌 Observações Técnicas

- **TTS (fala):** `speechSynthesis` com linguagem `pt-BR`.
- **Som de alerta:** WebAudio (oscillator + envelope de ganho).
- **Polling:** atualiza a UI a cada 5s.
- **Evitar repetição:** o front usa um `Set` (`knownAlerts`) para detectar alertas já “tocados”.

---

## 📁 Arquivos no projeto

- `Code.gs` — backend (Google Apps Script)
- `Barracao.html` — tela de envio
- `Cozinha.html` — tela de monitor
- `netlify/` — versões/artefatos HTML e imagem usada em testes/preview

---

## ✅ Próximos upgrades (ideias)

- Deduplicar pelo par (Item, Setor) além do `id`.
- Adicionar filtros (ex.: mostrar só certos setores).
- Registrar “quem concluiu” e “tempo até concluir”.
- Substituir polling por notificações (quando possível).

>>>>>>> b7ffa0f (Initial commit - Sirene Cozinha)
