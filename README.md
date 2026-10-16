# Naruto RPG Clash (demo de combate)

RPG de turno de fã inspirado em Naruto. Esta demo mostra o foco do projeto: o **visual do combate**.
Sasuke e Naruto lutam no Vale do Fim e, conforme o comando escolhido, o golpe é animado.

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

- Turnos: depois do seu golpe, o Naruto contra-ataca sozinho (Rasengan ou Kage Bunshin). Os jutsus gastam chakra e o chakra volta um pouco a cada turno. Se a vida do Sasuke zerar, aparece o K.O. do Naruto.

## Estrutura do projeto

- `naruto-demo.html`: so a pagina (HTML); `style.css`: o visual da pagina.
- `js/`: o codigo do jogo, em arquivos numerados que **carregam nessa ordem** (cada um depende dos anteriores): `01-core` (base e helpers), `02-characters`, `03-sprites`, `04-scenery`, `05-poses`, `06-attacks-basic`, `07-soushuken`, `08-mechanics`, `09-curse-seal`, `10-copy-jutsu`, `11-kyubi`, `12-state`, `13-audio`, `14-fx`, `15-render`, `16-cards`.
- `pixel/`: os sprites em pixel art desenhados por codigo (galeria em `pixel/view.html`).
- `tools/check-order.js`: confere se algum arquivo de `js/` usa, ao carregar, algo definido em um arquivo posterior. Rode depois de mover codigo entre arquivos: `npm i --no-save acorn` e `node tools/check-order.js`.
- Atencao: como os arquivos sao scripts separados, uma funcao so pode ser chamada **ao carregar** se ja estiver definida em um arquivo anterior. Chamadas feitas dentro de outras funcoes (executadas depois) funcionam de qualquer arquivo.
- As versoes antigas do visual (pixel art inicial, HD, chibi...) ficam no historico do Git; a pasta `versions/` foi removida.

## Aviso

Projeto de fã, sem fins comerciais. Naruto e seus personagens pertencem aos seus criadores e detentores de direitos.

- Fatalities: quando o golpe zera a vida do Naruto, cada golpe tem uma morte propria (Chidori, Katon, Kawarimi, Amaterasu, Soushuken, Shuriken Kage, Genjutsu Sharingan, Shishi Rendan, Selo Amaldicoado, copias do Rasengan e do Kage Bunshin, Kunai, Shuriken, Soco e Chute), em camera lenta.

## Tecnicas do Sasuke e balanceamento

| Tecnica | Chakra | Dano | Observacao |
|---|---|---|---|
| Genjutsu Sharingan | 12 | 14 | O inimigo perde o proximo turno |
| Shishi Rendan | 25 | 36 | Combo aereo de taijutsu copiado de Rock Lee |
| Selo Amaldicoado (Nivel 1) | 20 | 0 | Perde 8 de vida. Por 3 turnos: +30% de dano, +10 de chakra por turno, 30% de chance de desviar (custa 2 de vida por turno). Marcas pretas tribais, sem Chidori roxo (esse fica para a transformacao total) |
| Selo Amaldicoado (Nivel 2) | 40 | 0 | Transformacao: perde 15 de vida. Por 3 turnos: +60% de dano, +15 de chakra por turno, 40% de chance de desviar (custa 3 de vida por turno). Transformacao completa, sem as marcas do Nivel 1: pele azul-acinzentada, cabelo azul-grisalho e duas maos gigantes saindo das costas. Libera o Chidori Sombrio |
| Chidori Sombrio (Nivel 2) | 35 | 44 | So aparece com o Nivel 2 ativo. Chidori negro e roxo. Fatality: igual ao do Chidori normal (perfura o peito e arranca o braco), mas com energia roxa e negra, buraco bem maior e muito mais sangue |
| Copiar Tecnica (Sharingan) | 8 | 0 | Gasta o turno. Copia a ultima tecnica do inimigo (so Rasengan ou Kage Bunshin) |
| Copia: Rasengan | 18 | 22 | 60% do chakra e 75% do dano do original (30 de chakra, 30 de dano). Uso unico |
| Copia: Kage Bunshin | 15 | 24 | 60% do chakra e 75% do dano do original (25 de chakra, 32 de dano). Uso unico |

Cada uma tem um fatality diferente: Tsukuyomi (Genjutsu), calcanhar que crava a cabeca na agua (Shishi Rendan), a espiral que tritura em fatias (Rasengan copiado) e seis clones que lancam kunais (Kage Bunshin copiado).
## Pixel art (em andamento)

A pasta `pixel/` guarda os novos sprites em pixel art desenhados por codigo (`pixgrid.js` e os sprites do Sasuke e do Naruto). Para ver: `node serve.js` e abra http://localhost:8123/pixel/view.html (ou `?s=idle` para o Sasuke parado). 

## Jogar como Naruto
O botão **Jogar como: Sasuke / Naruto** (abaixo do jogo) troca de lado: a tela é espelhada (Naruto à esquerda), você escolhe **Rasengan**, **Kage Bunshin**, **Oiroke no Jutsu**, **Harem no Jutsu**, **Kamikaze**, **Kuchiyose: Gama Bunta**, **Uzumaki Rendan**, **Defender** ou **Concentrar**, e o Sasuke é jogado pela IA (escolhe um golpe que consegue pagar e vai no mais forte quando sua vida está baixa). A escolha fica salva no navegador.

### Naruto Uzumaki Rendan (35 de chakra, 40 de dano)
Quatro clones aparecem na fumaça, correm até o Sasuke e chutam ele para o alto em sequência ("U! ZU! MA! KI!"); o Naruto de verdade salta acima dele e desce com o calcanhar ("NARUTO UZUMAKI RENDAN!"). A IA do Naruto também usa este jutsu.

### Oiroke no Jutsu (10 de chakra, sem dano)
O Naruto se transforma numa garota (coberta por nuvens de fumaça) e solta coraçõezinhos. Com 60% de chance o Sasuke fica sem reação (sangra pelo nariz) e perde o próximo turno; senão ele responde "Patético.".

### Harem no Jutsu (20 de chakra, sem dano)
Oiroke + Kage Bunshin: seis garotas (cobertas por fumaça) cercam o Sasuke. Com 90% de chance ele é lançado para fora da tela com sangue no nariz e fica **2 turnos** sem se mexer.

### Uzumaki Naruto Kamikaze (30 de chakra, 34 de dano)
O Naruto gira como um tornado com três clones em volta e atravessa o Sasuke cinco vezes. **Fatality:** o tornado puxa o Sasuke para o alto, gira ele rasgando a roupa num redemoinho de sangue e o arremessa no chão; o Naruto diz "Ninguém me para, dattebayo!".

### Kuchiyose no Jutsu (45 de chakra)
O Naruto morde o polegar e bate a mão no chão com o chakra vermelho da Kurama; o selo aparece e o **Gama Bunta** surge numa nuvem de fumaça, com o Naruto em cima da cabeça. O sapo **fica em campo com 70 de vida**: os golpes do Sasuke acertam ele em vez do Naruto, e a cada turno ele dispara sozinho a bala de água (*Suiton: Teppōdama*, 14 de dano). Quando a vida acaba, ele some na fumaça e o Naruto volta ao chão.

### Layout de combate
O HUD agora tem placas de RPG com retrato, nome, **HP e chakra numéricos** (e a barra do sapo invocado, "SAPO") e os comandos ficam num painel com ícone, nome, descrição e custo de chakra. Com o Gama Bunta em campo ele vira o **alvo** dos golpes do Sasuke (o Naruto fica em pé na cabeça dele, sem apanhar), e os jutsus próprios do Naruto ficam bloqueados enquanto o sapo ataca sozinho.

Em cima do Gama Bunta o Naruto **não ataca de perto**: ele só pode arremessar **Kunai** (6 de dano) ou **Shuriken** (14 de dano) ficando na cabeça do sapo, ou usar Defender/Concentrar. Depois do turno dele, o sapo dispara o Teppōdama sozinho.

**Fatality do Gama Bunta:** se a bala de água zera a vida do Sasuke, o sapo salta e o esmaga com o corpo inteiro (câmera lenta no impacto), levanta, e o Sasuke fica achatado numa cratera de sangue; o Gama Bunta diz "Isso é o que dá mexer com o chefe do Monte Myōboku!".

O HUD (retratos, HP e chakra) agora fica numa faixa própria acima do cenário e não cobre mais a luta.

### Chakra da Kyūbi (Manto da Raposa)
Disponível uma vez por luta, com a vida do Naruto em **50 ou menos** (a IA usa sozinha quando chega a 40). O Naruto se curva, o chakra vermelho explode e um manto de chakra com orelhas e cauda de raposa o envolve, com os olhos vermelhos de pupila em fenda. Por **3 turnos** ele cura **+8 de vida** no fim de cada turno e os golpes dele causam **+35% de dano**.

No manto da Kyūbi o Naruto fica **de quatro**, como uma raposa, e o **Rasengan fica vermelho** (Rasengan da Kyūbi), infundido com o chakra dela.

**Fatality do Rasengan da Kyūbi:** se o Rasengan vermelho mata o Sasuke, a esfera cresce moendo o corpo inteiro, explode em vermelho e deixa um rombo maior, o corpo carbonizado com rachaduras em brasa e uma espiral queimada no chão; o Naruto volta de quatro e ruge.
