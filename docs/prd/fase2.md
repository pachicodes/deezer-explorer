# PRD — Fase 2: Estrutura inicial da toolchain (sem UI de produto)

## Objetivo

Criar o **menor** projeto **Vite + React + TypeScript** que **compila** e **roda localmente**, alinhado ao stack definido no [`PLAN.md`](../../PLAN.md), preparado para uma configuração consciente de **GitHub Pages** em fase posterior (sem fechar deploy nesta fase).

## Escopo

- Projeto na **raiz** do repositório (ou estrutura padrão do Vite que o plano assuma) com:
  - **Vite** como ferramenta de build e dev server;
  - **React**;
  - **TypeScript**;
  - **CSS puro** para estilos iniciais (sem framework de UI ou design system pesado).
- **`package.json`** com scripts claros para:
  - desenvolvimento (ex.: servidor local com hot reload);
  - build de produção gerando saída estática (ex.: pasta `dist`, padrão do Vite).
- **Um único componente raiz** (ou equivalente mínimo) que renderize **texto placeholder** — suficiente para provar que a árvore React monta; **sem** chamadas à API Deezer e **sem** fluxo de produto.
- **Atualização do [`README.md`](../../README.md)** com:
  - pré-requisitos mínimos (ex.: Node + gerenciador);
  - comandos documentados para instalar dependências, subir o dev server e gerar o build;
  - indicação honesta de que a UI ainda é placeholder (Fase 2).

## Fora do escopo

- Integração com a **API Deezer** ou implementação da camada cliente (Fase 3).
- **UI de produto**: busca, listas, grade de álbuns, detalhe de álbum, estados de vazio/erro/carregamento ligados a dados reais.
- **Roteamento** da aplicação além do mínimo que o template Vite exija (não introduzir roteamento de produto nesta fase).
- Configuração completa de **publicação no GitHub Pages** (`base`, workflow, domínio) — ver risco e Fase 8 no plano; apenas **não** tomar decisões que impeçam ajuste futuro sem necessidade.
- **Backend**, autenticação, variáveis secretas no cliente.
- Acrescentar **dependências de produção** sem justificativa alinhada a “poucas dependências” do [`PLAN.md`](../../PLAN.md).

## Fluxo de uso (esta fase)

Fluxo de **desenvolvedora**, não do usuário final do produto:

1. Clonar o repositório (ou copiar o estado após merge da Fase 2).
2. Instalar dependências com o comando documentado no README.
3. Executar o script de **desenvolvimento** e abrir a URL indicada pelo Vite.
4. Ver na página o **placeholder** definido pela PRD.
5. Executar o script de **build** e confirmar que a saída estática é gerada sem erro.
6. (Opcional recomendado) Pré-visualizar o build localmente com o fluxo documentado no README (ex.: `vite preview` ou servidor estático apontando para `dist`).

## Notas técnicas

- A stack da v1 (**Vite + React + TypeScript + CSS puro**) é a **fonte de verdade**; não substituir por outra toolchain nesta fase salvo decisão registrada no `PLAN.md`.
- Manter o projeto **pequeno e legível**; evitar pastas ou abstrações “para o futuro” que não sejam exigidas por esta fase.
- **Lockfile** (`package-lock.json`, `pnpm-lock.yaml`, etc.): incluir conforme o gerenciador escolhido, para instalação reproduzível.
- Se surgir necessidade de **exceção** a dependências mínimas, registrar motivo no *Registro de execução* abaixo e, se alterar premissa do plano, atualizar o `PLAN.md` antes (ver [`AGENTS.md`](../../AGENTS.md)).

## Critérios de aceite

1. Uma pessoa nova no repositório consegue subir o **servidor de desenvolvimento** e ver o app **apenas** com os comandos documentados no README.
2. `npm run build` (ou comando equivalente documentado) **conclui sem erro** e gera assets estáticos no diretório de saída do Vite (tipicamente `dist`).
3. **Nenhuma** dependência de produção é adicionada em violação ao princípio de **poucas dependências** sem motivo registrado no plano ou nesta PRD.
4. O **README** reflete que o repositório deixou de ser “somente planejamento” **no que diz respeito à toolchain** (scripts e como rodar/buildar).
5. Não há integração Deezer no código da aplicação nesta fase.

## Riscos / perguntas em aberto

- Valor incorreto de **`base`** no Vite pode quebrar caminhos de assets em **GitHub Pages** depois; tratar na **Fase 8** com calibragem explícita ([`PLAN.md`](../../PLAN.md)).
- Diferenças de versão de **Node** entre máquinas; mitigar documentando versão mínima recomendada ou campo `engines` no `package.json`, se útil.
- Escolha do gerenciador (**npm** vs **pnpm** vs **yarn**): padronizar o que o README instrui e manter um único lockfile principal.

## Registro de execução / decisão

Preencher **após** a implementação desta fase.

### Contexto

- Data da conclusão: *(preencher)*
- Versão do Node.js utilizada na validação: *(preencher)*
- Gerenciador de pacotes e comando de instalação documentado no README: *(preencher)*

### Evidências

- Comando de dev usado: *(preencher)* — resultado: *(sucesso / falha + nota)*
- Comando de build usado: *(preencher)* — saída em: *(ex.: `dist/`)*

### Decisões tomadas nesta fase

- *(Ex.: estrutura exata de pastas, nome dos scripts, inclusão de `vite preview` no README, etc.)*

### Notas para a Fase 3

- A camada cliente Deezer deve consumir a estratégia definida na [`fase1.md`](./fase1.md) (JSONP como caminho seguro no navegador nas premissas atuais).

---

## Checklist de conformidade com a PRD (tarefas)

Marque cada item ao conferir.

### Verificação: objetivo da PRD

- [ ] Existe projeto Vite + React + TypeScript mínimo que **compila** e **roda em dev**.

### Verificação: escopo

- [ ] Scripts de desenvolvimento e build estão no `package.json` e são os mesmos descritos no README.
- [ ] Componente raiz mostra **apenas** placeholder (sem Deezer).
- [ ] CSS puro (sem UI framework pesado).
- [ ] README atualizado com pré-requisitos e comandos.

### Verificação: fora do escopo

- [ ] Não há módulo cliente da API Deezer nem chamadas de rede para `api.deezer.com` na app.

### Verificação: critérios de aceite

- [ ] Novo colaborador pode seguir só o README para dev + build.
- [ ] Build gera saída estática sem erro.
- [ ] Dependências extras (se houver) estão justificadas ou ausentes.

### Verificação: validação manual

- [ ] Todos os passos da secção **Validação manual** (abaixo) foram executados e os checkboxes marcados.

---

## Validação manual

Esta secção fica no **fim** do documento; execute após a implementação.

### 1. Instalação limpa

1. Remova `node_modules` e artefatos de build locais (`dist`, etc.) conforme aplicável.
2. Execute o comando de instalação documentado no README (ex.: `npm ci` ou `npm install`).
3. Confirme que não há erros fatais.

- [ ] Instalação limpa concluída com sucesso.

### 2. Servidor de desenvolvimento

1. Execute o script de dev documentado (ex.: `npm run dev`).
2. Abra o endereço indicado no terminal (normalmente `http://localhost:5173`).
3. Confirme que o **placeholder** aparece.

- [ ] Dev server ok; placeholder visível.

### 3. Build de produção

1. Execute o script de build documentado (ex.: `npm run build`).
2. Confirme que a pasta de saída (ex.: `dist`) existe e contém HTML/JS/CSS gerados.

- [ ] Build concluído sem erro; artefatos em `dist` (ou equivalente).

### 4. (Opcional) Pré-visualização do build

1. Se documentado no README, execute o fluxo de preview (ex.: `vite preview`) ou sirva `dist` com um servidor estático breve.
2. Confirme que o placeholder ainda aparece.

- [ ] Preview ok **ou** N/A (documentado no README por que não se usa).

### Fecho

Quando todos os checkboxes desta secção e do checklist acima estiverem marcados, a **Fase 2** está fechada do ponto de vista desta PRD.
