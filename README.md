# Deezer Explorer

O Deezer Explorer é um app web estático e responsivo para descobrir artistas e álbuns por meio da API pública da Deezer. O usuário pesquisa um artista, escolhe um resultado, navega pelos álbuns desse artista em cartões de capa e abre um álbum para ver a lista de faixas, a data de lançamento e a imagem de capa.

## Estado atual

Este repositório está no início do projeto.

- O **PLAN.md** é a fonte da verdade para escopo, stack e fases de implementação.
- O **AGENTS.md** reúne notas de operação para quem implementa ou automatiza mudanças (incluindo agentes de IA).
- Ainda não há código de aplicação implementado.
- No momento, o repositório contém apenas artefatos de planejamento.

## Escopo da v1

A primeira versão é propositalmente restrita. Entrega um fluxo completo de descoberta:

1. Abrir o site.
2. Pesquisar um artista pelo nome.
3. Ver os resultados correspondentes de artistas.
4. Selecionar um artista.
5. Navegar pelos álbuns desse artista em cartões com arte de capa.
6. Abrir um álbum.
7. Ver a lista de faixas do álbum, a data de lançamento e a imagem de capa.

A superfície de API da v1 limita-se a estes endpoints da Deezer:

- `GET /search/artist?q=...`
- `GET /artist/{id}/albums`
- `GET /album/{id}`

## Fluxo do usuário

A experiência pretendida é simples e linear:

- O usuário chega a uma tela inicial focada na pesquisa.
- O usuário informa o nome do artista e envia a pesquisa.
- O app mostra correspondências de artistas.
- O usuário escolhe um artista.
- O app mostra os álbuns desse artista em cartões responsivos.
- O usuário abre um álbum para ver a lista de faixas e a data de lançamento.

O app deve oferecer estados de carregamento, vazio e erro em todo esse fluxo.

## Stack escolhida

O plano define uma direção concreta:

- Vite
- React
- TypeScript
- CSS puro com variáveis CSS e estilos pequenos escopados ao componente

Por que esta stack:

- O Vite combina com deploy estático no GitHub Pages e mantém o build simples.
- O React oferece um modelo de componentes claro para pesquisa, resultados, navegação por álbuns e vista de detalhe do álbum.
- O TypeScript ajuda no tratamento das respostas da API, com uma superfície externa pequena.
- O CSS puro mantém dependências baixas e evita prender o projeto a uma biblioteca de UI antes da forma do produto estar validada.

## Desenvolvimento local

A implementação ainda não começou; portanto, hoje não há app em execução. O fluxo local pretendido, depois que o scaffold inicial for adicionado, é:

1. Instalar dependências.
2. Subir o servidor de desenvolvimento do Vite.
3. Desenvolver contra a API da Deezer e verificar o fluxo principal no browser.
4. Gerar o bundle de produção.
5. Fazer preview do build de produção localmente antes de publicar.

Os scripts exatos do pacote serão introduzidos quando o scaffold do projeto for criado.

## Deploy no GitHub Pages

O ambiente final do app é o GitHub Pages. Por ser um site estático, o deploy precisa garantir que:

- os caminhos dos assets resolvam corretamente sob o subcaminho do repositório,
- a abordagem de navegação escolhida funcione em um host estático,
- o site publicado ainda suporte o fluxo completo da pesquisa até o álbum.

Se for usado roteamento no lado do cliente, a estratégia precisa permanecer compatível com o GitHub Pages. Se isso ficar desconfortável, uma abordagem baseada em hash pode ser a opção mais simples.

## Riscos e limitações conhecidos

O principal risco técnico é o acesso da Deezer a partir do browser.

- A Deezer pode bloquear requisições diretas do browser com CORS.
- Se o `fetch` padrão não funcionar, será necessário um fallback seguro para o browser.
- Não há backend neste projeto; a solução precisa continuar adequada a host estático.
- Arte dos álbuns e resultados de pesquisa podem variar em qualidade ou completude; a UI deve tolerar dados ausentes ou irregulares.
- O app deve permanecer utilizável em mobile e com navegação por teclado.

Essas restrições fazem parte do plano atual e serão verificadas cedo, antes de aprofundar a implementação.

## Próximos passos

Os próximos passos imediatos são:

1. Confirmar uma forma segura no browser de ler os endpoints da Deezer a partir de um site estático.
2. Criar o scaffold do app Vite + React + TypeScript.
3. Construir o shell do app com estados de carregamento, vazio e erro.
4. Integrar a pesquisa de artistas e a seleção de resultado.
5. Adicionar navegação por álbuns e vistas de detalhe do álbum.
6. Verificar acessibilidade e responsividade.
7. Configurar o deploy no GitHub Pages.

## Fora do escopo por enquanto

- Contas de usuário ou autenticação.
- Favoritos salvos ou dados persistentes do usuário.
- Histórico de pesquisa.
- Reprodução de áudio ou previews.
- Filtragem ou ordenação avançada.
- Backend customizado ou banco de dados.
- Polimento de design além do necessário para clareza, usabilidade e responsividade.
