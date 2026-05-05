# Glossário de termos técnicos

Este glossário explica termos usados no `README.md`, no `PLAN.md` e no `AGENTS.md`, com foco em quem está começando a contribuir no projeto.

## API (Application Programming Interface)

Conjunto de regras e endpoints usados para trocar dados entre sistemas. Neste projeto, usamos a API pública da Deezer para buscar artistas e álbuns.

## Asset

Arquivo estático usado pelo app, como CSS, JavaScript, imagens e fontes.

## Build

Processo de gerar a versão de produção do app a partir do código-fonte.

## CORS (Cross-Origin Resource Sharing)

Mecanismo do navegador que controla se um site pode acessar recursos de outro domínio. É um risco importante neste projeto porque os dados vêm da Deezer.

## Endpoint

URL específica de uma API. Exemplos neste projeto: `GET /search/artist?q=...`, `GET /artist/{id}/albums` e `GET /album/{id}`.

## Fallback

Plano alternativo usado quando a abordagem principal falha. Exemplo: se `fetch` direto não funcionar por CORS, pode ser necessário um fallback.

## Fetch

API nativa do navegador para fazer requisições HTTP.

## GitHub Pages

Serviço de hospedagem estática do GitHub. É o ambiente de publicação final do Deezer Explorer.

## Hash routing

Estratégia de navegação que usa `#` na URL (por exemplo, `site/#/album/123`) para evitar problemas de roteamento em hospedagem estática.

## Loading state (estado de carregamento)

Estado da interface enquanto uma requisição ainda está em andamento.

## Empty state (estado vazio)

Estado da interface quando a requisição funciona, mas não há dados para mostrar.

## Error state (estado de erro)

Estado da interface quando ocorre falha na requisição ou no processamento dos dados.

## Mobile first

Abordagem de design em que a interface é pensada primeiro para telas pequenas e depois adaptada para telas maiores.

## Parsing seguro

Validação e normalização dos dados recebidos da API antes de usar esses dados na interface.

## Placeholder

Conteúdo temporário exibido enquanto dados reais ainda não estão disponíveis.

## Publicação estática

Publicação de um site sem backend próprio, servindo apenas arquivos estáticos.

## Resiliência

Capacidade do app de continuar utilizável mesmo com falhas (rede instável, dados faltando, imagens quebradas).

## Responsividade

Capacidade da interface de se adaptar a diferentes tamanhos de tela.

## Roteamento

Forma como o app organiza e navega entre visões/telas.

## Shell do app

Estrutura base da interface (layout e regiões principais) antes de integrar os dados reais.

## Scaffolding (estrutura inicial do projeto)

Etapa de criação da base técnica do projeto (pastas, arquivos e configurações iniciais), para que o desenvolvimento possa começar de forma organizada.

## Toolchain

Conjunto de ferramentas de desenvolvimento, como Vite, TypeScript e scripts de build.

## Validação estreita

Validação pequena e focada no recorte recém-implementado, para confirmar rápido se aquele passo específico funciona.
