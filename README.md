# Deezer Explorer

App web estático para pesquisar artistas na Deezer, navegar por álbuns e abrir detalhes do álbum.

## O que é este projeto

O Deezer Explorer é um projeto de estudo com foco em um fluxo simples:

1. Pesquisar um artista.
2. Escolher o artista correto nos resultados.
3. Ver os álbuns desse artista.
4. Abrir um álbum e ver faixas, data de lançamento e capa.

## Estado atual

O projeto ainda está em planejamento.

- Ainda não há código da aplicação.
- Ainda não há scripts de execução documentados.
- O próximo passo é criar a estrutura inicial do app.

## Documentos importantes

- [`PLAN.md`](PLAN.md): escopo da v1, fases, critérios de aceite, riscos e decisões.
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
