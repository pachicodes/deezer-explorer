# PRD — Fase 1: Acesso seguro à Deezer no browser

## Goal

Confirmar, com evidência prática em navegador real, uma forma viável de acessar os 3 endpoints obrigatórios da Deezer diretamente do cliente (sem backend), compatível com publicação estática no GitHub Pages.

## Scope

Esta fase cobre apenas descoberta técnica, documentação e decisão.

- Validar acesso em navegador para:
  - `GET /search/artist?q=...`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- Testar comportamento real de CORS e conteúdo misto em uma origem semelhante à de produção.
- Registrar resultado em uma nota técnica objetiva (o que funciona, o que falha, em quais condições).
- Definir a estratégia recomendada para as próximas fases (por exemplo: `fetch` direto, fallback browser-safe, etc.).
- Registrar riscos imediatos para continuidade (ex.: limites de taxa, intermitência, formato de erro).

## Out of scope

- Implementar UI de produto.
- Criar scaffold do projeto (Vite/React/TypeScript).
- Implementar camada de cliente API em código de aplicação.
- Definir arquitetura além do necessário para provar acesso browser-safe.
- Introduzir backend, autenticação, banco de dados ou qualquer infra fora do escopo v1.

## User flow

Fluxo desta fase é de validação técnica (não fluxo final do usuário do produto):

1. Preparar um contexto de teste em navegador (localhost ou ambiente equivalente documentado).
2. Executar uma chamada real para busca de artista.
3. Extrair um `artist_id` válido e executar chamada de álbuns do artista.
4. Extrair um `album_id` válido e executar chamada de detalhe do álbum.
5. Registrar para cada chamada:
   - status HTTP,
   - comportamento de CORS no navegador,
   - presença/ausência de bloqueio por conteúdo misto,
   - se o JSON é parseável e útil para fases seguintes.
6. Consolidar decisão final da estratégia de acesso para a Fase 2/3.

## UI states

Mesmo sem UI final, os artefatos de validação desta fase devem contemplar estados observáveis equivalentes:

- **Idle**: ainda sem requisição executada.
- **Loading**: requisição em andamento.
- **Success**: resposta recebida e JSON parseável.
- **Empty**: resposta válida sem dados úteis (quando aplicável).
- **Error**: falha HTTP/rede.
- **Blocked by CORS**: requisição bloqueada pelo navegador por política de origem.
- **Mixed content blocked**: bloqueio por incompatibilidade HTTP/HTTPS.

## Technical notes

- A validação deve ocorrer em browser real (não apenas leitura de docs de terceiros).
- A origem de teste deve ser documentada e próxima do cenário de produção estática.
- A decisão final deve priorizar:
  1. compatibilidade com GitHub Pages,
  2. simplicidade operacional,
  3. baixa dependência externa.
- Não assumir suporte permanente da API sem evidência de execução prática.
- Caso exista mais de uma estratégia viável, registrar trade-offs de forma objetiva (simplicidade, confiabilidade, manutenção).

## Acceptance criteria

1. Os 3 endpoints obrigatórios foram testados em navegador real.
2. Existe ao menos uma estratégia browser-safe validada para os 3 endpoints.
3. A estratégia escolhida é compatível com publicação estática no GitHub Pages.
4. A decisão e as evidências estão documentadas de forma clara e reutilizável.
5. Riscos e dúvidas remanescentes estão explícitos para orientar a próxima fase.

## Risks / open questions

- A Deezer pode bloquear acesso direto por CORS em cenários reais.
- Pode haver diferença entre comportamento em localhost e GitHub Pages.
- Pode existir limitação por rate limit ou instabilidade sem aviso.
- Campos esperados podem variar entre respostas e afetar o desenho de tipos na Fase 3.
- Se nenhuma abordagem browser-safe funcionar para os 3 endpoints, será necessário revisar escopo e/ou premissas da v1 antes de avançar.

## Execution log / Decision record

### Test context

- Date: 2026-05-05
- Environment used for execution checks: terminal HTTP requests + CORS header inspection with `Origin: http://localhost:5173`.
- Validation matrix chosen for this phase: one browser (Chrome) with localhost origin documented.

### Endpoint evidence collected

- **`GET /search/artist?q=daft punk`**

  - HTTP: `200 OK`
  - JSON payload: valid and parseable
  - CORS headers present: `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`
  - `Access-Control-Allow-Origin`: not present in observed responses

- **`GET /artist/27/albums`**

  - HTTP: `200 OK`
  - JSON payload: valid and parseable
  - Same CORS behavior observed as above

- **`GET /album/494309801`**

  - HTTP: `200 OK`
  - JSON payload: valid and parseable
  - Same CORS behavior observed as above

### Alternative strategy check (JSONP)

JSONP output was verified for all 3 endpoints using:

- `output=jsonp`
- `callback=<functionName>`

Observed result:

- Responses returned as executable callback payloads (for example `dzTest({...})`, `dzAlbums({...})`, `dzAlbum({...})`).
- This indicates a browser-safe fallback path without introducing a backend in this phase.

### Decision

Decision for Phase 1:

- Do not assume direct browser `fetch` as the primary strategy yet, because `Access-Control-Allow-Origin` was not observed in responses under localhost-origin checks.
- Adopt JSONP as the validated browser-safe fallback for the v1 endpoints, pending explicit Chrome runtime confirmation in DevTools during manual validation.

Why this decision:

- Preserves static-host requirement (GitHub Pages).
- Avoids introducing backend scope.
- Keeps implementation aligned with v1 constraints while de-risking CORS.

### Notes for next phase

- Phase 2/3 should keep API access behind a dedicated client layer, so strategy can be switched later if direct `fetch` becomes reliably valid.
- Document trade-off: JSONP limits HTTP semantics (for example, status handling is less direct than `fetch`).

## Checklist de conformidade com a PRD (tarefas)

Marque cada item ao conferir. Use este bloco como lista de verificação final da Fase 1.

### Verificação: goal da PRD

- [x] Existe decisão documentada de caminho browser-safe para os 3 endpoints obrigatórios.

### Verificação: escopo

- [x] Apenas descoberta técnica + documentação + decisão (sem UI de produto).
- [x] Sem scaffold Vite/React/TypeScript nesta fase.
- [x] Sem camada cliente da app nesta fase.
- [x] Sem backend ou infra fora do escopo v1.

### Verificação: critérios de aceite

- [x] Os 3 endpoints foram exercitados com evidência registrada (ver seção *Execution log*).
- [x] Existe pelo menos uma estratégia browser-safe documentada (JSONP) para os 3 endpoints.
- [x] A decisão considera publicação estática (GitHub Pages).
- [x] Decisão e evidências estão no mesmo documento, reutilizáveis para a Fase 2/3.
- [x] Riscos e pontos em aberto estão explícitos (secção *Risks* + notas da decisão).

### Verificação: fora do escopo

- [x] Não foi adicionado código de aplicação nem scaffold neste repositório só por causa desta fase.

### Verificação: validação manual no browser

- [ ] Todos os passos da secção **Manual validation** (no fim deste documento) foram executados e os respetivos checkboxes marcados.

---

## Manual validation

Esta secção fica propositadamente no **fim** do documento: é o roteiro prático para fechar a Fase 1 no **Chrome**, com origem `http://localhost:5173` (porta típica do Vite; pode usar outra, desde que a documente no *Execution log*).

**Porquê precisar de `http://localhost`?** O browser aplica CORS com base na **origem** da página. Abrir ficheiros com `file://` ou `about:blank` costuma dar resultados diferentes de um site servido em HTTP; para a PRD, a origem deve ser semelhante à de desenvolvimento.

### 0. Preparar uma origem local (uma vez)

1. Na raiz do repositório, inicie um servidor estático que sirva a pasta atual. Exemplos (use um que tenha instalado):
   - `npx --yes serve -l 5173 .`
   - ou `npx --yes http-server -p 5173 .`
2. Abra no Chrome: `http://localhost:5173` (ou a URL que o comando mostrar).
3. Pressione `F12` (ou clique com o botão direito → *Inspecionar*) e abra o separador **Consola**.

**Nota:** Se ainda não tiver Node/npx, pode usar a extensão *Live Server* no VS Code/Cursor noutra porta; nesse caso, registe a origem exata (ex.: `http://127.0.0.1:5500`) no *Execution log* e use essa URL em todos os passos abaixo.

- [ ] Passo 0 concluído: consola aberta numa página servida em `http://localhost:...`.

### 1. Registar a origem e o contexto

1. Na consola, execute: `location.origin` e anote o valor (deve ser `http://localhost:5173` ou o que estiver a usar).
2. Abra o separador **Rede** (Network) e deixe-o aberto para os passos seguintes.

- [ ] Origem anotada; Rede (Network) aberto.

### 2. `fetch` — pesquisa de artista

1. Na consola, cole e execute (pode ajustar a query):

   ```js
   fetch("https://api.deezer.com/search/artist?q=daft%20punk")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Observe o resultado:
   - Se aparecer **objeto JSON** na consola: a requisição correu no browser; veja no separador **Rede** a entrada correspondente, **código de estado** (200, etc.) e, em *Cabeçalhos da resposta*, se existe `Access-Control-Allow-Origin`.
   - Se aparecer **erro de CORS** na consola: anote a mensagem; isso confirma bloqueio do browser (estado equivalente a *Blocked by CORS* na PRD).

- [ ] Teste de pesquisa de artista feito; resultado (sucesso ou erro) anotado.

### 3. `fetch` — álbuns do artista

1. Use um `artist_id` conhecido (ex.: `27` a partir da pesquisa anterior) e execute:

   ```js
   fetch("https://api.deezer.com/artist/27/albums")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirme no **Rede** o estado HTTP e, em caso de sucesso, que o JSON contém `data` com álbuns.

- [ ] Teste de álbuns feito; resultado anotado.

### 4. `fetch` — detalhe do álbum

1. Use um `album_id` obtido na lista de álbuns (ex.: do primeiro item em `data[].id`). Exemplo com `494309801`:

   ```js
   fetch("https://api.deezer.com/album/494309801")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirme que o objeto inclui pelo menos `title`, `release_date` e faixas em `tracks` (ou equivalente útil para a Fase 6).

- [ ] Teste de detalhe do álbum feito; resultado anotado.

### 5. DevTools — CORS e conteúdo misto

1. Para cada uma das três chamadas `fetch` acima, no separador **Rede**, clique no pedido à `api.deezer.com` e verifique:
   - **Estado** / código HTTP.
   - **Cabeçalhos da resposta**: presença ou ausência de `Access-Control-Allow-Origin` e outros cabeçalhos `Access-Control-*`.
2. **Conteúdo misto:** a página está em `http://localhost` (HTTP) e a API em `https://api.deezer.com` (HTTPS). Isto é um pedido *cross-origin* e misto em sentido amplo; o bloqueio típico de “mixed content” aplica-se quando a **página** é HTTPS e um recurso é HTTP **inseguro**. Aqui, anote só se o Chrome mostrar aviso explícito na consola ou na Rede (normalmente não bloqueia este padrão).

- [ ] Três pedidos revistos na Rede; CORS anotado; sem surpresa de mixed content **ou** comportamento documentado.

### 6. Utilidade dos payloads para fases seguintes

1. Confirme mentalmente (ou numa nota) que consegue extrair da resposta:
   - pesquisa: `data[].id`, `data[].name`, imagens opcionais;
   - álbuns: `data[].id`, `title`, `cover_*`, `release_date`;
   - álbum: `title`, `release_date`, lista de faixas em `tracks.data` (ou campo equivalente).
2. Se algum campo vier `null` ou em falta, isso é esperado: a Fase 3 tratará parsing defensivo.

- [ ] Campos necessários para as fases 3–6 identificados nas respostas reais.

### 7. JSONP nos três endpoints (fallback browser-safe)

O JSONP usa `<script src="...">` em vez de `fetch`, por isso o fluxo é diferente.

1. Na **mesma** página em `http://localhost:...`, na consola, defina um callback e injete o script **para pesquisa**:

   ```js
   window.dzSearch = function (data) { console.log("search", data); };
   const s1 = document.createElement("script");
   s1.src = "https://api.deezer.com/search/artist?q=daft%20punk&output=jsonp&callback=dzSearch";
   document.body.appendChild(s1);
   ```

2. Repita o padrão para álbuns e álbum (troque URL e nome da função):

   ```js
   window.dzAlbums = function (data) { console.log("albums", data); };
   const s2 = document.createElement("script");
   s2.src = "https://api.deezer.com/artist/27/albums?output=jsonp&callback=dzAlbums";
   document.body.appendChild(s2);
   ```

   ```js
   window.dzAlbum = function (data) { console.log("album", data); };
   const s3 = document.createElement("script");
   s3.src = "https://api.deezer.com/album/494309801?output=jsonp&callback=dzAlbum";
   document.body.appendChild(s3);
   ```

3. Confirme que em cada caso aparece log com objeto JSON no primeiro argumento do callback.

- [ ] JSONP testado para pesquisa, álbuns e detalhe do álbum; todos os callbacks executaram.

### Fecho

Quando todos os checkboxes desta secção estiverem marcados, marque também o item **Verificação: validação manual no browser** no *Checklist de conformidade com a PRD* mais acima.
