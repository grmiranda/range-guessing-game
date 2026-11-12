# AGENTS.md

Guia para agentes de IA (e pessoas) que trabalham neste repositório.

## Visão geral

**Sintonia** é um jogo web no formato SPA, pensado para ser jogado em **dispositivos móveis na orientação horizontal (landscape)**. Dois jogadores alternam o papel de Psíquico: o Psíquico vê um alvo secreto em uma roleta de 180° entre dois conceitos opostos e dá uma dica falada. O outro jogador posiciona o ponteiro. Vence quem atingir a meta de pontos primeiro, e um empate na meta leva a rodadas de desempate.

O plano de implementação está em `.cursor/plans/logica-do-jogo-sintonia.plan.md`.

## Stack

- **React 19** com componentes funcionais e hooks
- **TypeScript** em modo `strict`
- **Vite** como bundler e servidor de desenvolvimento
- **SCSS** (pacote `sass`) com CSS Modules e BEM
- **Vitest** com Testing Library e jsdom para testes unitários
- **Oxlint** para lint
- **npm** como gerenciador de pacotes

## Comandos

| Comando | Descrição |
| ----------------------- | ------------------------------------------------ |
| `npm install` | Instala as dependências |
| `npm run dev` | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build` | Checa tipos (`tsc -b`) e gera o build em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o Oxlint |
| `npm test` | Roda os testes uma vez |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run test:coverage` | Roda os testes com cobertura (mínimo de 80%) |

Para testar no celular na mesma rede: `npm run dev -- --host`.

## Estrutura

```
.cursor/
  rules/        # Regras do Cursor (.mdc) com convenções do projeto
  skills/       # Skills do Cursor específicas do projeto
  plans/        # Planos de implementação
public/         # Arquivos estáticos servidos na raiz
src/
  components/
    atoms/      # Button, TextInput, NumberInput, Heading
    molecules/  # FormField, PlayerScore, SpectrumLabels
    organisms/  # SetupForm, Scoreboard, Dial, GuessControl, HandoffPanel,
                # RevealPanel, Modal, HowToPlay, ConfirmDialog
    templates/  # ScreenTemplate
    pages/      # HomePage, GamePage, VictoryPage, ScreenRouter
  constants/    # Constantes do jogo e pares de conceitos (spectrums)
  context/      # Contexto e GameProvider (useReducer)
  hooks/        # Hooks React (prefixo use)
  styles/       # Estilos globais e tokens SCSS
  test/         # Setup e fixtures de teste
  types/        # Tipos do domínio
  utils/        # Funções puras (game/, dial/, classNames)
  App.tsx       # GameProvider + ScreenRouter
  main.tsx      # Ponto de entrada
```

## Convenções

- **Atomic Design:** cada componente fica em `src/components/<nível>/<Nome>/`, com `<Nome>.tsx`, `<Nome>.module.scss` e `<Nome>.test.tsx`.
- **Componentes:** nomes em `PascalCase`, um componente por arquivo, com `export default`. A interface de props fica local, sem `export`.
- **CSS:** BEM dentro de CSS Modules, com um bloco por arquivo em kebab-case (`.button`, `.button__icon`, `.button--primary`), acessado com `styles['button--primary']`. Use os tokens de `src/styles/_tokens.scss`.
- **Hooks:** ficam em `src/hooks/` e têm o nome começando por `use`, como `useGameActions.ts`.
- **Utils:** a lógica que não usa estado nem recursos do React fica em uma pasta `utils/`, como funções puras e sem o prefixo `use`.
- **Estado do jogo:** o reducer (`src/utils/game/gameReducer.ts`) é puro. Os valores aleatórios (baralho e ângulo do alvo) são gerados em `useGameActions` e chegam prontos nas ações.
- **Estilos globais:** ficam apenas em `src/styles/` e são importados uma única vez em `main.tsx`.
- **Tipos:** evite `any` e prefira tipos explícitos para props e retornos públicos. Não use `enum` (`erasableSyntaxOnly`); prefira uniões de strings.
- **Textos:** os textos visíveis ao usuário são em português (pt-BR).

## Mobile horizontal

- O layout tem como alvo telas em landscape: priorize unidades baseadas em altura (`vh`/`dvh`) e `clamp()` para tamanhos.
- Respeite as áreas seguras (`env(safe-area-inset-*)`) para notch e barras do sistema.
- A página não deve rolar: `html`, `body` e `#root` ocupam `100dvh` com `overflow: hidden`.
- Interações pensadas para toque (alvos de toque com pelo menos 44px).

## Antes de finalizar uma tarefa

1. `npm run lint` sem erros nem avisos.
2. `npm run test:coverage` passando, com cobertura mínima de 80%.
3. `npm run build` sem erros.
