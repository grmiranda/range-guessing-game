# Referencia:
Wavelength Online Game: https://furkankoykiran.com.tr/wavelength/
Github: https://github.com/furkankoykiran/wavelength

-----

# Contexto:
O projeto se trata de um jogo de comunicação em que duas pessoas competem para adivinhar a posição de um alvo secreto em um espectro de conceitos opostos.

## Descrição do Jogo:
- Número de jogadores: 2  pessoas (ou mais, idealmente dividido em 2 equipes).
- Duração: Cerca de 30 a 45 minutos.
- Objetivo: Ser a primeira equipe a alcançar um numero pré estabelecido de pontos.
- Tema: Empatia, leitura de mentes e sintonia fina entre os membros do grupo ( decidir onde algo se encaixa entre "Quente e Frio", "Chato e Divertido" ou "Inpopular e Popular")

## Como Funciona a Rodada (Regras Passo a Passo)
1- Divisão dos jogadores (ou equipes): Devem haver os campos para escrever o nomes dos jogadores/equipes. Apenas dois campos, sem opções de mais usuários + definição da pontuação necessária para a vitória.
2- Escolha do Psíquico: Em cada rodada, os jogadores alternam o papel de Psíquico (Vidente) do seu time.
3- O Alvo Secreto:
O Psíquico gira uma roleta de 180 graus e vê sozinho onde está a faixa colorida do alvo (que pode valer 2, 3 ou 4 pontos dependendo da proximidade do centro) e em cada lateral da roleta representa um dos conceitos opostos (ex: Lado A: Quente | Lado B: Frio). Apos essa etapa a faixa colorida deve ser escondida
4- O Palpite: O outro jogador gira o ponteiro da roleta no lugar que acredita corresponder à dica dada.
5- Revelação e Pontuação:
A faixa colorida é revelada e a posição exata do alvo é revelada
Quem deu Palpite: Ganha pontos (de 2 a 4) baseados na proximidade do ponteiro com o centro do alvo.
O Psíquico: Ganha 50% dos pontos de quem deu o palpite
6- Fim de jogo: Os papéis de Psíquico alternam entre os membros e o jogo encerra assim que um dos dois atinja os valor previamente definido de pontos

## Linguagem foco:
- O jogo no momento precisa funcionar unicamente em Português-BR, não há necessidade de modulos de controle de idiomas e pares de espectro em outras linguas

## Este projeto tera 3 interfaces principais:
1- Página de inicio, onde são definidos os nomes e a pontuação alvo
2- Página de jogo onde acontece as etapas e a alternancia enter os jogados
3- Pagina de vitória exibindo o ganhado e a opção de reiniciar (voltar para a página 1)

-----

# Regras de Código (Desenvolvimento):
- CSS/SCSS: Devem seguir o padrão BEM (Block-Element--Modifier)
- Esturura de pastas: Devem seguir o padrao Atomic Design, referencia: https://atomicdesign.bradfrost.com/chapter-2/
- Nomes de components devem seguir o padrão: CamelCase

-----

