---
name: naruto-rpg-clash-licoes
description: Licoes aprendidas e checklist obrigatorio ao mexer no jogo Naruto RPG Clash (pasta C:\Users\juxni\projetos\naruto-card-clash). Use SEMPRE antes de editar o jogo, ao criar inimigos/golpes/telas, e antes de dizer que terminou. Lista os erros ja cometidos (para nao repetir), armadilhas de ferramenta e o fluxo de trabalho que o usuario exige.
---

# Naruto RPG Clash: licoes aprendidas

O jogo e HTML5 canvas, turno, pixel art, em portugues. **A pasta do jogo e `C:\Users\juxni\projetos\naruto-card-clash`** (a sessao do Claude costuma abrir em `olien-digital`: sempre `cd` para a pasta do jogo). Servidor de teste: `http://localhost:8123/naruto-demo.html?x=<numero qualquer>`.
Leia o `README.md` do jogo: ele documenta cada sistema. Atualize-o ao mudar algo.

## 1. Fluxo exigido pelo usuario (nao negociar)
- Responder em portugues, direto. Quando o usuario diz "faz tudo", entregar **todos** os itens. Quando reclama de um bug, **verificar todos os casos parecidos** (ele repete isso: "verifique todos").
- Commitar localmente, perguntar **"Faco o push na main?"** e so dar push depois do "sim". O commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (ou o modelo atual).
- Testar **no navegador** antes de dizer que esta pronto (screenshot / frames). Nao afirmar "verificado" sem ter visto. Dizer com franqueza o que nao foi testado.
- Camera lenta/hitstop so no chefe final (nunca no meio da fase). Falas do jogo precisam ser legiveis e a camera vai para quem falou/atacou.
- O usuario joga em tela grande (~2000 px) e o navegador dele guarda cache: depois de mudar CSS/JS rodar `node tools/bump-cache.js` e avisar para recarregar com Ctrl+F5 se algo parecer velho.

## 2. Armadilhas de ferramenta (ja aconteceram varias vezes)
- **Heredoc grande no Bash quebra** ("unexpected EOF while looking for matching `'`") quando o texto mistura aspas, crases e `$`. Nada roda. Solucao: gravar o arquivo com a ferramenta **Write** (para `.js`, `.css`, `.py`) e depois rodar `python arquivo.py` ou `node --check`.
- **Python com string normal em scripts de patch**: `\b` vira backspace, `\n` vira quebra de linha real dentro de string JS, `\s` avisa. Use string crua `r'''...'''` ou escreva o patch com Write e confira o resultado (`grep`).
- Depois de cada edicao: `node --check <arquivo>.js` e `node tools/bump-cache.js` (cache busting) ; arquivos novos precisam de `<script>` em `naruto-demo.html` na ordem certa (`tools/check-order.js` valida; `pixel/*` carrega antes de `js/*`).
- `PixGrid.put(x,y,str)` com **x/y fracionario quebra** ("Cannot set properties of undefined"): use `Math.round`.
- No teste por `javascript_exec`: `startEncounter` com heroi do outro lado (Naruto/Gozu/Meizu <-> Sasuke/Sakura/Kakashi) **recarrega a pagina** e corta o script; espere e confira de novo. Terminar um teste: `resetCamp(); localStorage.setItem('playNaruto','0')`. Para vencer/perder: `showKO('S'|'N')`.
- Screenshot com viewport emulado grande sai em baixa resolucao: medir com `getComputedStyle`/`getBoundingClientRect` em vez de confiar na imagem; usar `resize_window preset desktop` ao terminar.
- `confirm()` trava testes: sobrescrever `window.confirm=()=>true` no teste.

## 3. Arquitetura que costuma dar erro
- **Dois lados da tela.** `roleN=false`: heroi (Sasuke/Sakura/Kakashi) na esquerda (lado S), inimigo na direita (lado N, sprite do Naruto + `enemySkin`). `roleN=true` (Naruto/Gozu/Meizu): tela espelhada, heroi no lado N e o inimigo no lado S (sprite do Sasuke). **Toda funcao nova de inimigo tem que funcionar nos dois lados**: sprite (`SPRE`/`SPRES`), IA (`commonPick`/`demonPick` no lado N; `aiSasuke`/`cmAiS` no lado S), animacao (`ANIMS.x` e `ANIMS.nx` espelhada), retrato (`portraitKind`), nome.
- **Inimigo cai na IA padrao** (Naruto/Sasuke com Chidori, Katon, Rasengan, Kage Bunshin...) se nao tiver kit proprio. Foi o bug do lobo que jogava shuriken/katon. Todo inimigo novo precisa de entrada em `CM_KIT` (ou IA propria) e **nunca** golpes de personagens (jutsus raros). Ninja comum: no maximo Kunai, Shuriken, Soco, Chute, Kawarimi.
- **Textos com nome fixo** ("Naruto", "Sasuke") em toasts/K.O.: usar `koName`, `cmEnemyName`, `cmHeroName`, `NN()`, `HN()`. Ja houve "SASUKE VENCEU" quando o lobo ganhou.
- **Camada de FX tem brilho (bloom)**: objetos solidos (armas, muros, cachorros) desenham na camada principal com `withG(c,fn)`.
- **Modo vila (`hubMode`)**: `blit()` nao desenha nada. Qualquer coisa que renderiza o canvas fora de luta (ex.: previa da arvore de habilidades) precisa fazer `hubMode=false` durante a captura e restaurar. Foi o bug "previa nao mostra nada".
- A previa da arvore e por personagem (`PREV[char:id]`) e precisa ajustar `roleN/heroS/playSkin/enemySkin` ao dono do golpe; sem isso mostrava o Sasuke para golpes da Sakura.
- Golpes de varios acertos no lado esquerdo aplicam o dano total em `hitT` (`effDmg`); os acertos extras sao so visuais. No lado direito `hits[]` e real.
- Precedencia em JS: `a||b&&c?d:e` vira `(a||b&&c)?d:e` (quebrou `SPRX`). Usar parenteses/ternario explicito.
- Chaves de paleta do PixGrid conflitam entre cabeca e corpo (um canvas = uma paleta). Cabecas de skin usam a paleta da skin (`NAR_PAL` + overrides); nao misturar chaves da paleta do Sasuke.
- Estado salvo (localStorage): `rpgProgV2` (niveis), `rpgInvV1` (itens/ryo), `rpgGachaV1` (invocacao), `rpgCampV1` (campanha + `phase`), `playNaruto`. **"Reiniciar" tem que zerar tudo** (`resetAll`): ja deixou Gozu/Meizu e itens para tras.
- Flags de teste (`TEST_UNLOCK_*`) devem ficar `false`; resets unicos usam chaves `*ResetV`.

## 4. CSS/HUD
- Estilos de botao sao **escopados** (`#map .learn`, `#inv .learn`): painel novo precisa dos proprios (`#gacha .learn`).
- Lista de comandos: `#hand{align-content:start}` (senao os cartoes esticam). Fontes usam `clamp()` e `cqw` (o `#stage` e container); com palco estreito o HUD empilha.
- Rotulos do mapa: usar `lp` (`t|b|l|r`) no no do mapa para nao sobrepor; no precisa estar em cima da terra (mascara de blobs em `paintMap`).
- Jogo em tela grande: o usuario reclama de texto pequeno com frequencia. Mirar fonte >= 15 px nos comandos e >= 13 px nos detalhes.

- Estado novo (loja, ramen, etc.) tem que entrar em `resetAll` e ser salvo em chave propria do localStorage.

## 5. Antes de dizer "pronto" (checklist)
1. `node --check` nos `.js` mexidos; `node tools/bump-cache.js`.
2. Testei no navegador **nos dois lados** (heroi Sasuke e heroi Naruto/Gozu) quando mexi em luta?
3. Inimigo novo: kit proprio, animacao propria, sprite/retrato/nome nos dois lados, fatality ou queda ok?
4. Textos mostram o nome certo? Vila/menus nao mostram luta?
5. Reiniciar jogo zera o que criei? Estado novo esta em `resetAll`?
6. README atualizado, commit feito, **perguntei antes do push**.
7. Registrei qualquer erro novo neste arquivo.

## 6. Registro de erros (acrescente aqui)
| Erro | Causa | Correcao |
|---|---|---|
| Lobo usava shuriken, Kawarimi e Katon | inimigo sem kit caia na IA do Naruto/Sasuke | `CM_KIT` + `commonPick`/`cmAiS` |
| "SASUKE VENCEU" quando o lobo ganhava | texto fixo no `showKO` | `koName()` |
| Previa de golpes em branco | `hubMode` faz `blit` nao desenhar | desligar `hubMode` na captura |
| Previa da Sakura mostrava Sasuke | cache por golpe e estado do heroi atual | `PREV` por `char:id` + ajuste de `roleN/heroS/enemySkin` |
| Reiniciar nao zerava Gozu/Meizu/itens | so zerava a campanha | `resetAll()` |
| Jogo abria dentro de uma luta | sem estado de vila | `hubMode` (modo vila) |
| Sprite da Sakura aparecia no inimigo | precedencia `a||b&&c?d:e` em `SPRX` | ternario explicito |
| Heredoc/Python quebravam patches | aspas/escapes | Write + script `.py` com string crua |
| Cartoes de comando esticados / HUD ilegivel | grid sem `align-content`, fontes pequenas | CSS com `clamp`/`cqw` |
| Rotulos do mapa sobrepostos | todos abaixo do no | campo `lp` por no |
| Texto aninhado em `<b>` ficou gigante no painel do mapa | regra `#map .foe .fi b` pegava o `<b>` interno | regra mais especifica `.adv b{font-size:inherit}` |
| Vantagem elemental invisivel para o jogador | painel so mostrava o elemento do inimigo | linha `Vantagem:` por inimigo + tabela de elementos + botao de sugerir escalacao |
| Balao de fala ('Queime!') longe do personagem | posicao calculada uma vez no inicio da fala e limitada a 24%; a camera se mexia depois | `speechSpot` + `speechFollow` (acompanha a camera a cada quadro, limite pela largura do balao) |
| Painel Proxima luta/Sair nunca aparecia (e a vitoria do heroi nao dava XP/butim) | o KO do golpe do heroi (`js/16-commands.js` `play`) so mexia no elemento `#ko` e nunca chamava `showKO`, onde ficam XP, butim e resultado | trocar por `showKO('S')`. REGRA: testar o fluxo REAL (golpe/fatality ate o K.O.), nao so chamar `showKO` na mao; toda vitoria/derrota passa por `showKO` |
| Balao de fala acima do personagem, mas deslocado na vertical | posicao em % do `#stage` (que inclui a faixa do HUD), nao do canvas | `speechSpot` usa `canvas.offsetLeft/Top/clientWidth/Height` em px e a ponta do balao (`--tl`) aponta para a cabeca |
| Contagem de turnos errada em teste | o teste chamava `showKO` com o turno do inimigo ainda travando | em testes, esperar o fim da animacao antes do proximo duelo; contar turnos por wrappers que checam `anim/turnLock` |
| Imagem de teste parecia 'dar zoom' no cenario | a montagem era mais larga que a janela (645 px) e o screenshot cortava a direita | montar imagens de conferencia com largura <= a da janela (`innerWidth`) |
| Cenario da vila com cores 'chapadas' e area do chao preta | pintura com muitas cores unicas estourou o pool de caracteres da paleta do PixGrid | gerar chave extra com `String.fromCharCode(0x100+n)` quando o pool acaba |
| Rostos do monte Hokage coloridos | cabelo/chapeu com cores reais | estatuas = so tons de pedra (areia/marrom), cabelo e chapeu entalhados, referencia do usuario |
| Mancha escura redonda no ceu da vila a noite | tentei esconder o sol da camada fixa pintando um circulo escuro por cima | construir duas camadas fixas (com sol e sem sol) e fazer fade entre elas; nunca tapar elemento pintado com overlay opaco |
| Raios de sol continuavam visiveis a noite | efeitos animados do sol nao dependiam da hora do dia | todo efeito de luz do sol multiplica por `(1 - tod.night)`; ao criar efeito diurno, checar tambem a versao noturna |
