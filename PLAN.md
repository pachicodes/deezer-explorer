# Deezer Explorer — Plano inicial

## Resumo do produto

O Deezer Explorer é um app web estático e responsivo que permite ao usuário pesquisar um artista, escolher um resultado, navegar pelos álbuns desse artista em cartões de capa e abrir um álbum para ver a lista de faixas, a data de lançamento e a imagem de capa.

O produto é propositalmente restrito: concentra-se em um fluxo claro de descoberta e usa apenas a API pública da Deezer para dados. Não há backend, autenticação ou banco de dados no escopo. O ambiente previsto é o GitHub Pages.

## Alinhamento às notas de operação do repositório

Implementadores e automação devem tratar o **AGENTS.md** como restrições de operação junto com este arquivo:

- **PLAN.md** (este documento): escopo do produto, fases, riscos e decisões em aberto que afetam como o app é construído.
- **README.md**: estado do repositório, resumo para desenvolvedores, fluxo do usuário e histórico de desenvolvimento/publicação quando existir.

Trabalhe em **fases pequenas**, cada uma produzindo algo **verificável de forma independente**. Prefira a menor mudança que prove a próxima decisão. Não introduza escolhas de stack, roteamento ou fluxo que quebrem a compatibilidade com GitHub Pages ou que não estejam fundamentadas aqui. Se escopo, stack, fases, riscos ou decisões que afetem o build mudarem, atualize este arquivo primeiro e mantenha o **README.md** consistente.

**Estado atual do repositório:** fase de planejamento; ainda não há estrutura inicial da aplicação nem comandos de desenvolvimento documentados. As primeiras fases que introduzirem ferramentas também devem documentar os comandos mínimos para executar e compilar o app.

## Escopo da v1

A primeira versão inclui exatamente esta jornada do usuário.
Observação: a etapa de pesquisa retorna uma lista de possíveis correspondências, e o usuário escolhe o artista correto dentro dessa lista.

1. Abrir o site.
2. Pesquisar um artista pelo nome.
3. Ver os artistas retornados pela pesquisa.
4. Selecionar o artista correto entre os resultados.
5. Ver a lista de álbuns desse artista em cartões com capas.
6. Abrir um álbum.
7. Ver a lista de faixas do álbum, a data de lançamento e a imagem de capa.

### Endpoints de API obrigatórios na v1

- `GET /search/artist?q=...`
- `GET /artist/{id}/albums`
- `GET /album/{id}`

### Limites funcionais da v1

- Fluxo em página única é aceitável se mantiver a navegação simples e segura para GitHub Pages.
- O app deve tratar estados de **vazio**, **carregamento** e **erro** em todo lugar onde houver busca de dados; isso é obrigatório, não polimento.
- O layout deve ser **mobile first** e permanecer utilizável em telas maiores.
- A **navegação por teclado** deve funcionar para pesquisa, escolha de artista, escolha de álbum e fechar ou voltar do detalhe do álbum.
- O app deve ser publicável como **site estático** no GitHub Pages.
- Mantenha **dependências baixas**, salvo se uma dependência resolver um problema concreto já identificado aqui (por exemplo, CORS ou ferramentas de build).

## Stack inicial

### Direção escolhida

- **Vite** — build adequado a sites estáticos, saída de produção simples.
- **React** — componentes claros para pesquisa, resultados, grade de álbuns e detalhe do álbum.
- **TypeScript** — tratamento mais seguro dos payloads da API externa.
- **CSS puro** (variáveis + estilos pequenos escopados ao componente) — sem framework de UI ou design system pesado na v1.

### Por que esta stack

- Combina com publicação estática no GitHub Pages e uma base de código pequena.
- TypeScript ajuda nas poucas formas de resposta externa das quais o app depende.
- CSS puro está alinhado ao objetivo de manter poucas dependências.

### Status da decisão de stack

Esta stack permanece o padrão da v1 **salvo se surgir um problema concreto de implementação** (por exemplo, restrição de build incompatível ou bloqueio que só outra toolchain resolva). Não há mudança de stack nesta revisão; as fases abaixo assumem Vite + React + TypeScript + CSS puro.

---

## Fases de implementação

Cada fase abaixo é propositalmente **estreita**, termina com **critérios de aceite explícitos** e deve ser **validada** antes da seguinte. Use a validação mais barata que ainda seja significativa (validações manuais são aceitáveis onde ainda não houver testes automatizados).

### Fase 1 — Acesso à Deezer seguro no browser (caminho da API)

**Objetivo**  
Demonstrar como o browser pode ler dados da Deezer nos três endpoints da v1 sem backend próprio, em condições compatíveis com hospedagem estática (HTTPS, sem chaves secretas no cliente).

**Entregas**

- Uma **decisão** breve e escrita neste repositório (seção neste arquivo ou documento dedicado com link no README): `fetch` direto, proxy público, fallback estilo JSONP ou outro — com justificativa.
- Uma **reprodução mínima**: por exemplo, uma página HTML temporária servida localmente, ou passos no DevTools/console, que mostre respostas reais para:
  - pesquisa de artista,
  - álbuns do artista,
  - álbum por id.
- Uma **nota sobre CORS** e conteúdo misto: o que funciona em um browser real a partir de uma origem semelhante à de produção (servidor de desenvolvimento local é aceitável se documentado).

**Critérios de aceite**

1. Pelo menos uma abordagem está **confirmada em um browser real** (não só lendo documentação de terceiros) para os três endpoints.
2. A abordagem escolhida é **compatível com publicação estática no GitHub Pages** (sem servidor privado obrigatório controlado por este app).
3. A abordagem é **simples o suficiente** para manter o cliente com poucas dependências; se fosse necessário proxy ou serviço intermediário, isso seria mudança de escopo e deve ser registrado aqui antes.
4. Riscos e itens de continuidade (por exemplo, limites de taxa, formas de erro) estão **listados** para a próxima fase.

**Validação manual**

- Executar os passos documentados no Chrome ou Firefox (ou nos dois se o CORS diferir).
- Confirmar que o JSON é utilizável no código cliente (parseável, campos esperados presentes em uma resposta de exemplo).

**Riscos**

- A Deezer pode bloquear requisições diretas do browser (CORS).
- Se não existir caminho seguro no browser sem backend, o escopo da v1 ou as premissas de hospedagem precisam ser revistos.

---

### Fase 2 — Estrutura inicial da toolchain (sem UI de produto)

**Objetivo**  
Criar o menor projeto Vite + React + TypeScript que compila e roda localmente, preparado para configuração consciente do GitHub Pages depois.

**Entregas**

- Raiz do projeto com Vite, React e TypeScript configurados.
- Scripts no `package.json` para **desenvolvimento** e **build de produção** (nomes documentados no README quando o README for atualizado para a implementação).
- Um único componente raiz que renderiza texto placeholder (sem integração com a Deezer ainda).

**Critérios de aceite**

1. Um novo colaborador consegue subir o servidor de desenvolvimento e ver o app usando apenas comandos documentados.
2. `npm run build` (ou equivalente do gerenciador escolhido) conclui sem erro e gera assets estáticos em `dist` (ou padrão do Vite).
3. Nenhuma dependência de produção é adicionada em violação a “poucas dependências” sem motivo registrado neste plano.
4. O repositório reflete que o projeto deixa de ser “somente planejamento” no que diz respeito a ferramentas (linha de status do README quando você atualizar o README).

**Validação manual**

- Instalação limpa, executar dev, executar build, abrir visualização local do build se for usado.

**Riscos**

- `base` incorreto depois pode quebrar URLs de assets no GitHub Pages; anotar para a Fase 8.

---

### Fase 3 — Módulo cliente Deezer (apenas três endpoints)

**Objetivo**  
Centralizar chamadas aos três endpoints da v1 usando a estratégia validada na Fase 1, com tratamento de erro previsível.

**Entregas**

- Um módulo pequeno (ou três funções) que exponha: pesquisar artistas, buscar álbuns por id do artista, buscar álbum por id.
- **Formas** de requisição/resposta tipadas (ou tipos estreitos + parsing seguro) alinhadas ao que a UI precisará.
- Tratamento consistente de **erros de rede** e respostas HTTP **não OK** (expõe um tipo ou mensagem de erro simples para a UI).

**Critérios de aceite**

1. As três operações passam por esta camada (sem `fetch` ad hoc espalhado em componentes).
2. Quem chama consegue distinguir **carregamento**, **sucesso** e **falha** sem analisar `Response` cru na UI.
3. O comportamento coincide com o documentado na Fase 1 (mesma estratégia de URL, cabeçalhos ou contorno).
4. Existe uma **validação estreita**: chamada manual a partir de um botão só para desenvolvimento ou tela temporária, ou um teste automatizado pequeno se você adicionar runner de testes — o suficiente para provar o módulo antes de montar o shell completo.

**Validação manual**

- Disparar cada função uma vez com id/query conhecidos e confirmar dados parseados.
- Disparar falha (offline ou id inválido) e confirmar o caminho de erro.

**Riscos**

- Campos nulos na API; imagens opcionais — os tipos devem permitir capa ausente sem quebrar.

---

### Fase 4 — Shell do app, layout e placeholders de estado

**Objetivo**  
Construir a estrutura visível do fluxo completo usando **apenas dados mock ou vazios**: regiões, ordem de foco e estados explícitos da UI.

**Entregas**

- Layout responsivo com áreas distintas: pesquisa, resultados de artistas, grade de álbuns, detalhe do álbum (ou empilhamento equivalente em coluna única em telas pequenas).
- Um **modelo de estado** explícito por área (ou por etapa do fluxo) para carregamento, vazio, erro e sucesso — ligado a **placeholders** para que as transições sejam visíveis sem a Deezer.
- **Ordem de tab** sensata e controles focáveis para todo elemento interativo do shell.

**Critérios de aceite**

1. O layout é utilizável de **~320px de largura** para cima, sem rolagem horizontal no fluxo principal (exceto overflow opcional da lista de faixas tratado de forma legível).
2. Sem chamadas à API, o usuário consegue percorrer com tab pesquisa → resultados → álbuns → controles do detalhe em ordem **previsível**.
3. Cada área pode ser forçada (por exemplo, com alternadores temporários de desenvolvimento) a mostrar conteúdo placeholder de **carregamento**, **vazio**, **erro** e **sucesso** sem colapso de layout.
4. Nenhuma escolha de roteamento é introduzida que **quebre o GitHub Pages** (evitar modo histórico de SPA em subcaminho sem mitigação documentada).

**Validação manual**

- Redimensionar a viewport; percurso só com tab pelo shell; alternar cada estado.

**Decisões em aberto** (não bloqueiam a fase; documente a escolha quando tomada)

- Detalhe do álbum como seção inline versus painel sobreposto.
- Se a seleção deve aparecer na URL na v1.

---

### Fase 5 — Pesquisa e seleção de artista

**Objetivo**  
Ligar a UI de pesquisa ao `GET /search/artist` e persistir o artista escolhido para as fases seguintes.

**Entregas**

- Campo de pesquisa e envio (ou pesquisa só com debounce se estiver documentado — prefira envio por submit para previsibilidade, salvo se acrescentar debounce ao plano).
- Lista de resultados com **nome** e **imagem quando disponível**; layout estável quando a imagem falta.
- A seleção armazena **id do artista** (e campos de exibição necessários) no estado do app.
- Estados de resultados de pesquisa **vazios**, **carregamento** e **erro**.
- Nova pesquisa **substitui** o artista atual e limpa a UI dependente (álbuns/detalhe) de forma definida.

**Critérios de aceite**

1. Consulta conhecida devolve uma lista coerente com o conteúdo da API para essa consulta.
2. Consulta sem sentido mostra mensagem dedicada de **vazio**, não lista em branco ou quebrada.
3. Falha de rede mostra estado de **erro** claro sem derrubar o app.
4. Todo o caminho é utilizável **só com teclado** (enviar, mover foco para resultados, selecionar).
5. Após selecionar um artista, a UI está pronta para carregar álbuns (mesmo que álbuns ainda sejam stub até a Fase 6).

**Validação manual**

- Caminho feliz, vazio, erro, só teclado, repetir pesquisa após seleção.

**Riscos**

- Resultados ruidosos; a UI deve deixar a linha selecionada inequívoca.

---

### Fase 6 — Lista de álbuns e detalhe do álbum

**Objetivo**  
Carregar álbuns do artista selecionado e mostrar detalhe com lista de faixas, data de lançamento e capa; suportar **voltar** sem perder o contexto do artista.

**Entregas**

- Grade ou lista de álbuns com **cartões de capa**; capa ausente tratada.
- Buscar `GET /album/{id}` na seleção; mostrar **lista de faixas** (ordem da API), **data de lançamento**, **capa**.
- **Voltar** do detalhe para a lista de álbuns; **contexto do artista** preservado.
- **Carregamento** e **erro** para lista e detalhe; falha no detalhe **não** limpa o artista selecionado.

**Critérios de aceite**

1. Álbuns exibidos após selecionar artista correspondem a esse artista na API.
2. A tela de detalhes corresponde ao id do álbum selecionado (conferir título e contagem de faixas).
3. Voltar retorna à lista de álbuns com a lista ainda utilizável; o segundo álbum substitui o detalhe de forma limpa.
4. Listas longas de faixas rolam ou quebram linha sem destruir o layout da página.
5. Teclado: o usuário vai dos álbuns ao detalhe e **volta** sem mouse.

**Validação manual**

- Dois álbuns diferentes do mesmo artista; voltar; erro na busca do álbum; caminho só com teclado.

**Riscos**

- Proporção de imagens; títulos longos — o CSS deve evitar capas distorcidas.

---

### Fase 7 — Rodada de acessibilidade e resiliência

**Objetivo**  
Fechar lacunas para uso real com teclado e mobile e para rede ou imagens instáveis.

**Entregas**

- Estilos de **foco** visíveis em todos os controles interativos.
- **Cabeçalhos**, **botões** e **landmarks** semânticos onde melhorarem a navegação.
- Texto **alt** em imagens ou marcação decorativa conforme boas práticas HTML; fallback de imagem quebrada não desloca o layout de forma catastrófica.
- Textos e rótulos para pesquisa, resultados, álbuns, voltar/fechar.
- **Link “pular para o conteúdo”** opcional só se o layout final justificar (documente de qualquer forma).

**Critérios de aceite**

1. Jornada completa (pesquisa → artista → álbum → detalhe → voltar) funciona com **Tab**, **Shift+Tab**, **Enter** e **Escape** quando aplicável, sem armadilhas de foco.
2. O texto principal permanece legível em larguras comuns de mobile.
3. Falha de rede simulada em cada etapa de fetch deixa a UI **recuperável** (usuário pode tentar de novo ou pesquisar de novo).
4. Nenhum controle interativo fica sem foco ou com foco invisível.

**Validação manual**

- Uma passagem completa só com teclado; viewport mobile; offline ou requisições bloqueadas no DevTools.

---

### Fase 8 — Publicação no GitHub Pages

**Objetivo**  
Publicar o build estático e confirmar o comportamento na URL real do Pages.

**Entregas**

- GitHub Actions ou publicação manual documentada que publique a saída `dist` do Vite no GitHub Pages.
- **URL base** / `base` no Vite alinhado ao caminho do repositório (site de projeto versus site de usuário); links de assets funcionando.
- **Checklist de publicação** curto no README (quando o README for atualizado): build, base path, teste de fumaça.

**Critérios de aceite**

1. O app carrega na URL de produção do GitHub Pages **sem bundle principal ou CSS quebrados**.
2. **Assets estáticos** resolvem sob o caminho publicado (conferir aba de rede).
3. O fluxo principal (pesquisa → artista → álbuns → detalhe) funciona **na URL publicada**, não só em localhost.
4. **Atualizar** a página no site publicado não deixa o usuário em tela em branco para o modelo de navegação escolhido (hash, vista única sem deep links ou fallback documentado de SPA).

**Validação manual**

- Abrir URL publicada; executar fluxo principal; atualizar no meio do fluxo conforme a escolha de roteamento; verificar carregamento das imagens.

**Riscos**

- Configuração errada de hospedagem em subcaminho; roteamento no cliente sem fallback `404.html` se usar modo histórico.

**Decisões em aberto**

- Roteamento por hash versus por caminho versus vista única sem deep links — decidir antes de considerar a Fase 8 concluída.

---

## Nota sobre GitHub Pages

Hospedagem estática mantém as operações simples; o principal risco é **base path incorreto** ou premissas de **roteamento no cliente**. Valide o comportamento na URL de produção antes de anunciar o primeiro release público.

## Fora do escopo da v1

- Contas de usuário ou autenticação.
- Favoritos ou qualquer dado persistente por usuário.
- Histórico de pesquisa.
- Reprodução, previews ou controles de áudio.
- Filtragem ou ordenação avançada além do fluxo básico.
- Recursos no servidor, bancos de dados ou backend próprio controlado por este projeto.
- Frameworks de UI ou design systems com muitas dependências.
- Polimento visual além do necessário para clareza, usabilidade, responsividade e acessibilidade conforme acima.