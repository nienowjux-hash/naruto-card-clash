# Naruto Card Clash (demo de combate)

Jogo de cartas de fã inspirado em Naruto. Esta demo mostra o foco do projeto: o **visual do combate**.
Sasuke e Naruto lutam no Vale do Fim e, conforme a carta escolhida, o golpe é animado.

Tudo é desenhado por código (HTML5 Canvas), sem imagens externas.

## Como rodar

Opção 1: abra o arquivo `naruto-demo.html` direto no navegador (Chrome ou Edge).

Opção 2: com Node instalado, rode `node serve.js` e abra http://localhost:8123

## Controles

- Clique numa carta, ou tecle `1` (Chidori), `2` (Katon), `3` (Kawarimi) ou `4` (Amaterasu).
- Zerando a vida do Naruto aparece o K.O., com Sasuke em pose de vitória. Use "Resetar luta" para recomeçar.

## O que já existe

- Personagens: Sasuke e Naruto (Parte 1), com corpo, mãos, cabelo e expressões desenhados por código.
- Cenário do Vale do Fim animado (cachoeira, névoa, lua, estátuas).
- Câmera dinâmica, hitstop, tremor de tela e brilho (bloom).
- Golpes: Chidori (corrida, rastro, pássaros de raio, impacto), Katon (bola de fogo, ondas de fogo), Kawarimi (tronco, fumaça e contra-ataque) e Amaterasu (Mangekyō e chamas negras).

- Dano persistente: cada golpe deixa marcas no corpo (sangue, cortes, hematomas, queimaduras, roupa rasgada e chamuscada), e o rosto fica machucado. O Amaterasu continua queimando até resetar, tirando vida aos poucos.

## Versões antigas

A pasta `versions/` guarda os estágios anteriores do visual (pixel art, HD, chibi, etc.) para comparação.

## Aviso

Projeto de fã, sem fins comerciais. Naruto e seus personagens pertencem aos seus criadores e detentores de direitos.
