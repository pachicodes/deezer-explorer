# Deezer Explorer

App web estático para pesquisar artistas na Deezer, navegar por álbuns e abrir detalhes do álbum.

## O que é este projeto

O Deezer Explorer é um projeto de estudo com foco em um fluxo simples:

1. Pesquisar um artista.
2. Escolher o artista correto nos resultados.
3. Ver os álbuns desse artista.
4. Abrir um álbum e ver faixas, data de lançamento e capa.

## Estado atual

A **Fase 1** (descoberta técnica do acesso à API Deezer no navegador) está **concluída** e registrada na PRD abaixo. Decisão resumida: **`fetch` direto não é a estratégia principal** no cliente atual por causa de CORS; **JSONP** foi validado nos três endpoints obrigatórios da v1 em cenário real de navegador.

O repositório **ainda não contém** o scaffold da aplicação (Vite/React/TypeScript): **não há código da UI**, nem `package.json` nem comandos de desenvolvimento ou build neste README até a **Fase 2**.

**Próximo passo:** estrutura inicial da toolchain conforme [`PLAN.md`](PLAN.md) (Fase 2).

## Documentos importantes

- [`PLAN.md`](PLAN.md): escopo da v1, fases, critérios de aceite, riscos e decisões.
- [`docs/prd/fase1.md`](docs/prd/fase1.md): PRD e registro de execução da Fase 1 (CORS, JSONP, validação manual).
- [`AGENTS.md`](AGENTS.md): regras de trabalho para implementação e automação.
- [`GLOSSARIO.md`](GLOSSARIO.md): explicação dos termos técnicos usados no projeto.

## Escopo da v1 (resumo)

- Endpoints usados:
  - `GET /search/artist?q=...`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- Sem backend, autenticação ou banco de dados.
- Compatível com GitHub Pages (site estático).
- Comportamentos obrigatórios: estados de carregamento, vazio e erro.
- Usabilidade obrigatória: mobile first e navegação por teclado.

Para detalhes completos do escopo e das fases, consulte o [`PLAN.md`](PLAN.md).

## Fora do escopo por enquanto

- Contas de usuário
- Favoritos salvos
- Histórico de pesquisa
- Reprodução de áudio ou preview
- Filtros e ordenação avançados
- Backend customizado e banco de dados
