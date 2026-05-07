# PRD — Fase 1: Acesso seguro à Deezer no navegador

## Objetivo

Confirmar, com evidência prática em navegador real, uma forma viável de acessar os 3 endpoints obrigatórios da Deezer diretamente do cliente (sem backend), compatível com publicação estática no GitHub Pages.

## Escopo

Esta fase cobre apenas descoberta técnica, documentação e decisão.

- Validar acesso em navegador para:
  - `GET /search/artist?q=...`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- Testar comportamento real de CORS e conteúdo misto em uma origem semelhante à de produção.
- Registrar resultado em uma nota técnica objetiva (o que funciona, o que falha, em quais condições).
- Definir a estratégia recomendada para as próximas fases (por exemplo: `fetch` direto, fallback seguro no navegador, etc.).
- Registrar riscos imediatos para continuidade (ex.: limites de taxa, intermitência, formato de erro).

## Fora do escopo

- Implementar UI de produto.
- Criar scaffold do projeto (Vite/React/TypeScript).
- Implementar camada de cliente API em código de aplicação.
- Definir arquitetura além do necessário para provar acesso seguro no navegador.
- Introduzir backend, autenticação, banco de dados ou qualquer infra fora do escopo v1.

## Fluxo de uso (esta fase)

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

## Estados equivalentes de UI

Mesmo sem UI final, os artefatos de validação desta fase devem contemplar estados observáveis equivalentes:

- **Idle**: ainda sem requisição executada.
- **Loading**: requisição em andamento.
- **Success**: resposta recebida e JSON parseável.
- **Empty**: resposta válida sem dados úteis (quando aplicável).
- **Error**: falha HTTP/rede.
- **Blocked by CORS**: requisição bloqueada pelo navegador por política de origem.
- **Mixed content blocked**: bloqueio por incompatibilidade HTTP/HTTPS.

## Notas técnicas

- A validação deve ocorrer em navegador real (não apenas leitura de docs de terceiros).
- A origem de teste deve ser documentada e próxima do cenário de produção estática.
- A decisão final deve priorizar:
  1. compatibilidade com GitHub Pages,
  2. simplicidade operacional,
  3. baixa dependência externa.
- Não assumir suporte permanente da API sem evidência de execução prática.
- Caso exista mais de uma estratégia viável, registrar trade-offs de forma objetiva (simplicidade, confiabilidade, manutenção).

## Critérios de aceite

1. Os 3 endpoints obrigatórios foram testados em navegador real.
2. Existe ao menos uma estratégia segura no navegador validada para os 3 endpoints.
3. A estratégia escolhida é compatível com publicação estática no GitHub Pages.
4. A decisão e as evidências estão documentadas de forma clara e reutilizável.
5. Riscos e dúvidas remanescentes estão explícitos para orientar a próxima fase.

## Riscos / perguntas em aberto

- A Deezer pode bloquear acesso direto por CORS em cenários reais.
- Pode haver diferença entre comportamento em localhost e GitHub Pages.
- Pode existir limitação por rate limit ou instabilidade sem aviso.
- Campos esperados podem variar entre respostas e afetar o desenho de tipos na Fase 3.
- Se nenhuma abordagem segura no navegador funcionar para os 3 endpoints, será necessário revisar escopo e/ou premissas da v1 antes de avançar.

## Registro de execução / decisão

### Contexto do teste

- Data: 2026-05-05
- Ambiente usado nas verificações: requisições HTTP via terminal + inspeção de cabeçalhos CORS com `Origin: http://localhost:5173`.
- Matriz de validação escolhida para esta fase: um navegador (Chrome), com origem em localhost documentada.
- **Validação manual:** concluída no Chrome (passos 0–7); confirmação de JSONP no Console para os três endpoints da v1.

### Resultados da validação manual no navegador (Chrome)

Registro objetivo do que foi observado ao seguir a seção **Validação manual** (além das evidências via terminal acima):

| Etapa | Endpoint / ação | Resultado observado |
| --- | --- | --- |
| `fetch` | `GET /search/artist?q=daft punk` | Bloqueado por CORS a partir da página: ausência de `Access-Control-Allow-Origin` na origem local (`http://localhost:5173`). |
| `fetch` | `GET /artist/27/albums` | Mesmo bloqueio por CORS (`http://localhost:5173`). |
| `fetch` | `GET /album/494309801` | Mesmo bloqueio por CORS com origem `http://127.0.0.1:5500` (Live Server); mensagem equivalente no Console (`Failed to fetch` / rede com 200 mas sem exposição do corpo ao JS). |
| Rede (passo 5) | Os três `fetch` para `api.deezer.com` | Confirmado na aba **Rede** (Chrome): para cada fluxo equivalente aos endpoints da v1, **HTTP 200**; pedido com **`Origin`** da página local e modo **CORS**. Nas **cabeçalhos de resposta** há vários `Access-Control-*` (por exemplo métodos, cabeçalhos permitidos, credenciais), porém **não há `Access-Control-Allow-Origin`** permitindo leitura pelo JS dessa origem — consistente com o erro no Console. **Mixed content** no sentido “página HTTPS + recurso HTTP inseguro” não aplicável aqui; nenhum aviso relevante observado para página HTTP → API HTTPS. |
| JSONP | Os três endpoints com `output=jsonp` | **Confirmado no Chrome** (validação manual, passo 7): callbacks `dzSearch`, `dzAlbums` e `dzAlbum` executaram; no Console apareceram objetos com **estrutura análoga** ao JSON da API — pesquisa e álbuns com listas em `data`, detalhe do álbum como objeto raiz com campos esperados (título, faixas, etc.), em linha com o uso nas fases seguintes. |

**Nota:** `localhost` e `127.0.0.1` em portas diferentes são **origens distintas** para CORS; mantenha no projeto a origem que usar nos testes finais.

**Detalhe registrado (exemplo inspecionado):** para `GET https://api.deezer.com/search/artist?q=daft%20punk` a partir de `http://127.0.0.1:5500`, na rede aparece **200 OK**, corpo JSON na resposta, cabeçalhos como `access-control-allow-methods`, `access-control-allow-headers`, `access-control-allow-credentials: true`, **sem** `access-control-allow-origin` na lista observada — alinhado ao bloqueio de CORS do `fetch`.

### Passo 6 — Campos úteis para as fases 3–6 (confirmado)

Com base em **respostas reais** da API (estrutura equivalente ao JSON com HTTP 200 — inclusive inspecionável na aba **Rede** em *Visualização*/*Resposta*, ou conferível fora do navegador sem bloqueio de CORS):

| Recurso | Caminhos no JSON | Observação |
| --- | --- | --- |
| Pesquisa de artista | `data[].id`, `data[].name`; imagens em `picture_small`, `picture_medium`, `picture_big`, etc. | Lista em `data`. |
| Álbuns do artista | `data[].id`, `data[].title`, `data[].release_date`; capas em `cover_small`, `cover_medium`, etc. | Alinha ao fluxo de grade de capas da v1. |
| Detalhe do álbum | Raiz: `title`, `release_date`; faixas: `tracks.data[]` (ex.: `title` em cada faixa). | `tracks` agrupa o array em `data` — útil para a lista de faixas na Fase 6. |

Parsing defensivo na Fase 3 cobre `null` ou campos ausentes pontuais.

### Evidências coletadas por endpoint

- **`GET /search/artist?q=daft punk`**

  - HTTP: `200 OK`
  - JSON no corpo: válido e passível de parse
  - Cabeçalhos CORS presentes: `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`
  - `Access-Control-Allow-Origin`: não presente nas respostas observadas

- **`GET /artist/27/albums`**

  - HTTP: `200 OK`
  - JSON no corpo: válido e passível de parse
  - Mesmo comportamento de CORS observado acima

- **`GET /album/494309801`**

  - HTTP: `200 OK`
  - JSON no corpo: válido e passível de parse
  - Mesmo comportamento de CORS observado acima

### Verificação de estratégia alternativa (JSONP)

Saída JSONP foi verificada nos 3 endpoints com:

- `output=jsonp`
- `callback=<nomeDaFunção>`

Resultado observado:

- Respostas retornadas como cargas executáveis de callback (por exemplo `dzTest({...})`, `dzAlbums({...})`, `dzAlbum({...})`).
- Indica um caminho de fallback seguro no navegador sem introduzir backend nesta fase.
- **Confirmação no navegador:** na validação manual (passo 7), os três endpoints foram exercidos via `<script>` + JSONP no Chrome; os callbacks receberam payloads utilizáveis, no mesmo espírito que as respostas JSON observadas por terminal.

### Decisão

Decisão da Fase 1:

- Não assumir `fetch` direto no navegador como estratégia principal por enquanto, porque `Access-Control-Allow-Origin` compatível com a origem da página não foi observado nas respostas — nem nas verificações por terminal com `Origin: http://localhost:5173`, nem na **aba Rede** do Chrome com origem local documentada na validação manual (passo 5).
- Adotar **JSONP** como fallback seguro no navegador para os endpoints da v1 — **confirmado em tempo de execução no Chrome** na validação manual (passo 7: callbacks executados para pesquisa, álbuns e detalhe do álbum).

Por que esta decisão:

- Preserva o requisito de hospedagem estática (GitHub Pages).
- Evita expandir o escopo para backend.
- Mantém a implementação alinhada às restrições da v1 enquanto reduz o risco de CORS.

### Notas para a próxima fase

- As fases 2/3 devem manter o acesso à API atrás de uma camada cliente dedicada, para poder trocar de estratégia depois se o `fetch` direto se tornar confiável.
- Registrar trade-off: JSONP limita a semântica de HTTP (por exemplo, tratamento de status é menos direto que com `fetch`).

## Checklist de conformidade com a PRD (tarefas)

Marque cada item ao conferir. Use este bloco como lista de verificação final da Fase 1.

### Verificação: objetivo da PRD

- [x] Existe decisão documentada de caminho seguro no navegador para os 3 endpoints obrigatórios.

### Verificação: escopo

- [x] Apenas descoberta técnica + documentação + decisão (sem UI de produto).
- [x] Sem scaffold Vite/React/TypeScript nesta fase.
- [x] Sem camada cliente da app nesta fase.
- [x] Sem backend ou infra fora do escopo v1.

### Verificação: critérios de aceite

- [x] Os 3 endpoints foram exercitados com evidência registrada (ver seção *Registro de execução*).
- [x] Existe pelo menos uma estratégia segura no navegador documentada (JSONP) para os 3 endpoints.
- [x] A decisão considera publicação estática (GitHub Pages).
- [x] Decisão e evidências estão no mesmo documento, reutilizáveis para a Fase 2/3.
- [x] Riscos e pontos em aberto estão explícitos (seção *Riscos / perguntas em aberto* + notas da decisão).

### Verificação: fora do escopo

- [x] Não foi adicionado código de aplicação nem scaffold neste repositório só por causa desta fase.

### Verificação: validação manual no navegador

- [x] Todos os passos da seção **Validação manual** (no fim deste documento) foram executados e os respectivos checkboxes marcados.

---

## Validação manual

Esta seção fica propositadamente no **fim** do documento: é o roteiro prático para fechar a Fase 1 no **Chrome**, com origem `http://localhost:5173` (porta típica do Vite; pode usar outra, desde que a registre no *Registro de execução*).

**Por que usar `http://localhost`?** O navegador aplica CORS com base na **origem** da página. Abrir arquivos com `file://` ou `about:blank` costuma dar resultados diferentes de um site servido em HTTP; para a PRD, a origem deve ser semelhante à de desenvolvimento.

### 0. Preparar uma origem local (uma vez)

1. Na raiz do repositório, inicie um servidor estático que sirva a pasta atual. Exemplos (use um que tenha instalado):
   - `npx --yes serve -l 5173 .`
   - ou `npx --yes http-server -p 5173 .`
2. Abra no Chrome: `http://localhost:5173` (ou a URL que o comando mostrar).
3. Pressione `F12` (ou clique com o botão direito → *Inspecionar*) e abra a aba **Console** do DevTools.

**Nota:** Se você ainda não tiver Node/npx, pode usar a extensão *Live Server* no VS Code/Cursor em outra porta; nesse caso, registre a origem exata (ex.: `http://127.0.0.1:5500`) no *Registro de execução* e use essa URL em todos os passos abaixo.

- [x] Passo 0 concluído: Console do DevTools aberto em uma página servida em `http://localhost:...`.

### 1. Registrar a origem e o contexto

1. No Console, execute: `location.origin` e anote o valor (deve ser `http://localhost:5173` ou o que estiver usando).
2. Abra a aba **Rede** (*Network*) e deixe-a aberta para os passos seguintes.

- [x] Origem anotada; aba Rede (Network) aberta.

### 2. `fetch` — pesquisa de artista

1. No Console, cole e execute (pode ajustar a query):

   ```js
   fetch("https://api.deezer.com/search/artist?q=daft%20punk")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Observe o resultado:
   - Se aparecer **objeto JSON** no Console: a requisição foi concluída no navegador; confira na aba **Rede** a entrada correspondente, **código de status** (200, etc.) e, em *cabeçalhos de resposta*, se existe `Access-Control-Allow-Origin`.
   - Se aparecer **erro de CORS** no Console: anote a mensagem; isso confirma bloqueio do navegador (estado equivalente a *Blocked by CORS* na PRD).

- [x] Teste de pesquisa de artista feito; resultado (sucesso ou erro) anotado.

### 3. `fetch` — álbuns do artista

1. Use um `artist_id` conhecido (ex.: `27` a partir da pesquisa anterior) e execute:

   ```js
   fetch("https://api.deezer.com/artist/27/albums")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirme na aba **Rede** o status HTTP e, em caso de sucesso, que o JSON contém `data` com álbuns.

- [x] Teste de álbuns feito; resultado anotado.

### 4. `fetch` — detalhe do álbum

1. Use um `album_id` obtido na lista de álbuns (ex.: do primeiro item em `data[].id`). Exemplo com `494309801`:

   ```js
   fetch("https://api.deezer.com/album/494309801")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirme que o objeto inclui pelo menos `title`, `release_date` e faixas em `tracks` (ou equivalente útil para a Fase 6).

- [x] Teste de detalhe do álbum feito; resultado anotado.

### 5. DevTools — CORS e conteúdo misto

1. Para cada uma das três chamadas `fetch` acima, na aba **Rede**, clique na requisição para `api.deezer.com` e verifique:
   - **Estado** / código HTTP.
   - **Cabeçalhos de resposta**: presença ou ausência de `Access-Control-Allow-Origin` e outros cabeçalhos `Access-Control-*`.
2. **Conteúdo misto:** a página está em `http://localhost` (HTTP) e a API em `https://api.deezer.com` (HTTPS). Isso é uma requisição *cross-origin* e, em sentido amplo, mistura HTTP/HTTPS; o bloqueio típico de “mixed content” aplica-se quando a **página** é HTTPS e um recurso é HTTP **inseguro**. Aqui, anote só se o Chrome mostrar aviso explícito no Console ou na aba Rede (normalmente não bloqueia este padrão).

- [x] Três requisições revisadas na Rede; CORS anotado; sem surpresa de mixed content **ou** comportamento documentado.

### 6. Utilidade dos payloads para fases seguintes

1. Confirme mentalmente (ou em uma nota) que consegue extrair da resposta:
   - pesquisa: `data[].id`, `data[].name`, imagens opcionais;
   - álbuns: `data[].id`, `title`, `cover_*`, `release_date`;
   - álbum: `title`, `release_date`, lista de faixas em `tracks.data` (ou campo equivalente).
2. Se algum campo vier `null` ou em falta, isso é esperado: a Fase 3 tratará parsing defensivo.

- [x] Campos necessários para as fases 3–6 identificados nas respostas reais.

### 7. JSONP nos três endpoints (fallback seguro no navegador)

O JSONP usa `<script src="...">` em vez de `fetch`, por isso o fluxo é diferente.

1. Na **mesma** página em `http://localhost:...`, no Console, defina um callback e injete o script **para pesquisa**:

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

- [x] JSONP testado para pesquisa, álbuns e detalhe do álbum; todos os callbacks executaram.

### Fecho

Quando todos os checkboxes desta seção estiverem marcados, marque também o item **Verificação: validação manual no navegador** no *Checklist de conformidade com a PRD* mais acima.
