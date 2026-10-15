# Naruto RPG Clash (demo de combate)

RPG de turno de fã inspirado em Naruto. Esta demo mostra o foco do projeto: o **visual do combate**.
Sasuke e Naruto lutam no Vale do Fim e, conforme a carta escolhida, o golpe é animado.

Tudo é desenhado por código (HTML5 Canvas), sem imagens externas.

## Como rodar

Opção 1: abra o arquivo `naruto-demo.html` direto no navegador (Chrome ou Edge).

Opção 2: com Node instalado, rode `node serve.js` e abra http://localhost:8123

## Controles

- Menu de comandos (teclas 1 a 4): **Atacar** (1 Kunai, 2 Shuriken, 3 Soco, 4 Chute, sem custo de chakra), **Jutsu** (abre as técnicas; Esc volta), **Defender** (próximo dano pela metade) e **Concentrar** (+25 de chakra).
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

- Fatalities: quando o golpe zera a vida do Naruto, cada golpe tem uma morte propria (Chidori, Katon, Kawarimi, Amaterasu, Soushuken, Shuriken Kage, Genjutsu Sharingan, Shishi Rendan, Selo Amaldicoado, copias do Rasengan e do Kage Bunshin, Kunai, Shuriken, Soco e Chute), em camera lenta.

## Tecnicas do Sasuke e balanceamento

| Tecnica | Chakra | Dano | Observacao |
|---|---|---|---|
| Genjutsu Sharingan | 12 | 14 | O inimigo perde o proximo turno |
| Shishi Rendan | 25 | 36 | Combo aereo de taijutsu copiado de Rock Lee |
| Selo Amaldicoado (Nivel 1) | 20 | 0 | Perde 8 de vida. Por 3 turnos: +30% de dano, +10 de chakra por turno, 30% de chance de desviar (custa 2 de vida por turno). Marcas pretas tribais, sem Chidori roxo (esse fica para a transformacao total) |
| Selo Amaldicoado (Nivel 2) | 40 | 0 | Transformacao: perde 15 de vida. Por 3 turnos: +60% de dano, +15 de chakra por turno, 40% de chance de desviar (custa 3 de vida por turno). Pele azul-acinzentada, cabelo longo, marcas pretas pelo corpo e maos gigantes nas costas. Libera o Chidori Sombrio |
| Chidori Sombrio (Nivel 2) | 35 | 44 | So aparece com o Nivel 2 ativo. Chidori negro e roxo. Fatality: perfura, as marcas se espalham pelo Naruto e ele vira pedra negra e se despedaca |
| Copiar Tecnica (Sharingan) | 8 | 0 | Gasta o turno. Copia a ultima tecnica do inimigo (so Rasengan ou Kage Bunshin) |
| Copia: Rasengan | 18 | 22 | 60% do chakra e 75% do dano do original (30 de chakra, 30 de dano). Uso unico |
| Copia: Kage Bunshin | 15 | 24 | 60% do chakra e 75% do dano do original (25 de chakra, 32 de dano). Uso unico |

Cada uma tem um fatality diferente: Tsukuyomi (Genjutsu), calcanhar que crava a cabeca na agua (Shishi Rendan), a espiral que tritura em fatias (Rasengan copiado) e seis clones que lancam kunais (Kage Bunshin copiado).