# Notas de operação do agente — Deezer Explorer

## Visão geral do projeto

O Deezer Explorer está planejado como um app web estático e responsivo para pesquisar artistas, navegar pelos álbuns e abrir detalhes do álbum por meio da API pública da Deezer. O produto é propositalmente restrito e focado em um fluxo principal:

1. Pesquisar um artista.
2. Escolher um resultado entre os artistas.
3. Navegar pelos álbuns desse artista em cartões de capa.
4. Abrir um álbum.
5. Ver a lista de faixas, a data de lançamento e a imagem de capa do álbum.

O ambiente final é o GitHub Pages. Não há backend, autenticação ou banco de dados no escopo.

## Escopo atual da v1

O plano da v1 é a fonte da verdade sobre o que construir primeiro. O escopo da v1 limita-se aos endpoints da Deezer abaixo:

- `GET /search/artist?q=...`
- `GET /artist/{id}/albums`
- `GET /album/{id}`

A experiência da v1 deve oferecer estados de carregamento, vazio e erro, e permanecer utilizável em dispositivos móveis e com navegação por teclado.

## Fontes da verdade

Use estes arquivos como principais fontes da verdade do projeto:

- **PLAN.md** — escopo do produto, fases de implementação, riscos e decisões em aberto.
- **README.md** — estado atual do repositório, resumo voltado a desenvolvedores e fluxo pretendido do usuário.

Se houver conflito entre suposições e esses documentos, atualize os documentos primeiro ou alinhe a alteração de código a eles.

## Como trabalhar neste repositório

Antes de propor mudanças, leia **PLAN.md** e **README.md** e use-os para fundamentar o próximo passo. Não invente escolhas de stack, endpoints, detalhes de fluxo ou comportamento de deploy que não estejam respaldados nesses arquivos.

Quando a tarefa exigir implementação, trabalhe em **fases pequenas** que possam ser validadas de forma independente. Prefira a menor mudança que prove a próxima decisão. Evite reescritas amplas ou mudanças arquiteturais especulativas.

Se uma decisão alterar escopo, stack, fluxo ou modelo de deploy, atualize **PLAN.md** primeiro e depois atualize **README.md** para manter os dois consistentes.

## Estado técnico atual

O repositório ainda está na fase de planejamento.

- Ainda não há código de aplicação.
- Ainda não há comandos documentados de build, teste ou desenvolvimento.
- Comandos para desenvolvimento local, preview ou deploy precisarão ser introduzidos quando o scaffold do projeto for criado.

Não assuma gerenciadores de pacotes, scripts ou estrutura de pastas que não existam no repositório.

## Expectativas de qualidade

Mantenha mudanças específicas, testáveis e alinhadas ao fluxo documentado.

- Valide cedo o caminho de acesso à Deezer seguro para o browser, pois **CORS** é um risco real.
- Preserve comportamento mobile first e usabilidade com teclado.
- Trate estados de carregamento, vazio e erro como **comportamento obrigatório**, não como polimento opcional.
- Mantenha dependências baixas, salvo se uma dependência resolver um problema concreto já identificado no plano.
- Garanta que a compatibilidade com **GitHub Pages** faça parte de toda decisão de implementação.

## Expectativas de validação

Use a validação mais barata que ainda seja significativa para a mudança feita.

- Para mudanças em documentação, verifique o conteúdo do arquivo diretamente e confirme que a redação está alinhada ao plano.
- Para mudanças de implementação, valide o recorte tocado antes de expandir o escopo.
- Para qualquer decisão de acesso à API, confirme o comportamento no browser em vez de assumir que a API da Deezer aceitará requisições padrão.

Se existir uma validação estreita, execute-a antes de trabalhos de acompanhamento não relacionados.

## Regras de atualização de documentos

Atualize **PLAN.md** quando qualquer um destes itens mudar:

- escopo da v1,
- escolha de stack,
- fases de implementação,
- riscos conhecidos,
- decisões em aberto que afetem como o app é construído.

Atualize **README.md** quando qualquer um destes itens mudar:

- resumo do projeto,
- estado atual do repositório,
- fluxo de usuário documentado,
- história de desenvolvimento local,
- história de deploy,
- riscos de alto nível e próximos passos.

Mantenha os dois documentos honestos. Se a implementação ainda não começou, diga isso claramente em vez de descrever um produto pronto.

## O que não inventar nem assumir

Não introduza nenhum dos itens abaixo sem alinhamento explícito com o plano:

- serviço de backend,
- autenticação,
- banco de dados,
- reprodução de áudio ou previews,
- favoritos salvos,
- histórico de pesquisa,
- filtragem ou ordenação avançada,
- framework de UI ou design system com muitas dependências,
- abordagem de roteamento que quebre a compatibilidade com GitHub Pages,
- comandos que na prática não existam no repositório.

Se um requisito ainda estiver em aberto, mantenha-o em aberto e documente o ponto de decisão em vez de chutar.
