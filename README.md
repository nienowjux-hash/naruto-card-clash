# Naruto RPG Clash (demo de combate)

RPG de turno de fã inspirado em Naruto. Esta demo mostra o foco do projeto: o **visual do combate**.
Sasuke e Naruto lutam no Vale do Fim e, conforme a carta escolhida, o golpe é animado.

Tudo é desenhado por código (HTML5 Canvas), sem imagens externas.

## Como rodar

Opção 1: abra o arquivo `naruto-demo.html` direto no navegador (Chrome ou Edge).

Opção 2: com Node instalado, rode `node serve.js` e abra http://localhost:8123

## Controles

- Menu de comandos (teclas 1 a 4): **Atacar** (1 Kunai, 2 Shuriken, 3 Soco, 4 Chute, sem custo de chakra), **Jutsu** (abre as técnicas: 1 Chidori, 2 Katon, 3 Kawarimi, 4 Amaterasu, 5 Sōshūken no Jutsu, 6 Shuriken Kage no Jutsu; Esc volta), **Defender** (próximo dano pela metade) e **Concentrar** (+25 de chakra).
- Zerando a vida do Naruto aparece o K.O., com Sasuke em pose de vitória. Use "Resetar luta" para recomeçar.

## O que já existe

- Personagens: Sasuke e Naruto (Parte 1), com corpo, mãos, cabelo e expressões desenhados por código.
- Cenário do Vale do Fim animado (cachoeira, névoa, lua, estátuas).
- Câmera dinâmica, hitstop, tremor de tela e brilho (bloom).
- Golpes: Chidori (corrida, rastro, pássaros de raio, impacto), Katon (bola de fogo, ondas de fogo), Kawarimi (tronco, fumaça e contra-ataque) e Amaterasu (Mangekyō e chamas negras).

- Dano persistente: cada golpe deixa marcas no corpo (sangue, cortes, hematomas, queimaduras, roupa rasgada e chamuscada), e o rosto fica machucado. O Amaterasu continua queimando até resetar, tirando vida aos poucos.

- Turnos: depois da sua carta, o Naruto contra-ataca sozinho (Rasengan ou Kage Bunshin). As cartas gastam chakra e o chakra volta um pouco a cada turno. Se a vida do Sasuke zerar, aparece o K.O. do Naruto.

## Versões antigas

A pasta `versions/` guarda os estágios anteriores do visual (pixel art, HD, chibi, etc.) para comparação.

## Aviso

Projeto de fã, sem fins comerciais. Naruto e seus personagens pertencem aos seus criadores e detentores de direitos.

- Fatalities: quando o golpe zera a vida do Naruto, cada um dos 10 golpes tem uma morte propria (Chidori, Katon, Kawarimi, Amaterasu, Soushuken, Shuriken Kage, Kunai, Shuriken, Soco e Chute), em camera lenta.
