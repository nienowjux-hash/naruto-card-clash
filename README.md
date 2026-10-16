# Naruto RPG Clash (demo de combate)

RPG de turno de fã inspirado em Naruto. Esta demo mostra o foco do projeto: o **visual do combate**.
Sasuke e Naruto lutam no Vale do Fim e, conforme o comando escolhido, o golpe é animado.

Tudo é desenhado por código (HTML5 Canvas), sem imagens externas.

## Como rodar

Opção 1: abra o arquivo `naruto-demo.html` direto no navegador (Chrome ou Edge).

Opção 2: com Node instalado, rode `node serve.js` e abra http://localhost:8123

## Controles

- Menu de comandos (teclas 1 a 5): **Atacar** (1 Kunai, 2 Shuriken, 3 Soco, 4 Chute, sem custo de chakra), **Jutsu** (abre as técnicas; Esc volta), **Defender** (próximo dano pela metade), **Concentrar** (+25 de chakra) e **Kawarimi** (evita por completo o próximo golpe; veja abaixo).
- Zerando a vida do Naruto aparece o K.O., com Sasuke em pose de vitória. Use "Resetar luta" para recomeçar.

## O que já existe

- Personagens: Sasuke e Naruto (Parte 1), com corpo, mãos, cabelo e expressões desenhados por código.
- Cenário do Vale do Fim animado (cachoeira, névoa, lua, estátuas).
- Câmera dinâmica, hitstop, tremor de tela e brilho (bloom).
- Golpes: Chidori (corrida, rastro, pássaros de raio, impacto), Katon (bola de fogo, ondas de fogo), Amaterasu (Mangekyō e chamas negras).

- Dano persistente: cada golpe deixa marcas no corpo (sangue, cortes, hematomas, queimaduras, roupa rasgada e chamuscada), e o rosto fica machucado. O Amaterasu continua queimando até resetar, tirando vida aos poucos.

- Turnos: depois do seu golpe, o Naruto contra-ataca sozinho (Rasengan ou Kage Bunshin). Os jutsus gastam chakra e o chakra volta um pouco a cada turno. Se a vida do Sasuke zerar, aparece o K.O. do Naruto.

## Estrutura do projeto

- `naruto-demo.html`: so a pagina (HTML); `style.css`: o visual da pagina.
- `js/`: o codigo do jogo, em arquivos numerados que **carregam nessa ordem** (cada um depende dos anteriores): `01-core` (base e helpers), `02-characters`, `03-sprites`, `04-scenery`, `05-poses`, `06-attacks-basic`, `07-soushuken`, `08-mechanics`, `09-curse-seal`, `10-copy-jutsu`, `11-kyubi`, `12-state`, `13-audio`, `14-fx`, `15-render`, `16-commands`.
- `pixel/`: os sprites em pixel art desenhados por codigo (galeria em `pixel/view.html`).
- `tools/check-order.js`: confere se algum arquivo de `js/` usa, ao carregar, algo definido em um arquivo posterior. Rode depois de mover codigo entre arquivos: `npm i --no-save acorn` e `node tools/check-order.js`.
- Atencao: como os arquivos sao scripts separados, uma funcao so pode ser chamada **ao carregar** se ja estiver definida em um arquivo anterior. Chamadas feitas dentro de outras funcoes (executadas depois) funcionam de qualquer arquivo.
- As versoes antigas do visual (pixel art inicial, HD, chibi...) ficam no historico do Git; a pasta `versions/` foi removida.

## Aviso

Projeto de fã, sem fins comerciais. Naruto e seus personagens pertencem aos seus criadores e detentores de direitos.

- Fatalities: quando o golpe zera a vida do Naruto, cada golpe tem uma morte propria (Chidori, Katon, Amaterasu, Soushuken, Shuriken Kage, Genjutsu Sharingan, Shishi Rendan, Selo Amaldicoado, copias do Rasengan e do Kage Bunshin, Kunai, Shuriken, Soco e Chute), em camera lenta.

## Tecnicas do Sasuke e balanceamento

| Tecnica | Chakra | Dano | Observacao |
|---|---|---|---|
| Genjutsu Sharingan | 12 | 14 | O inimigo perde o proximo turno (nao funciona em turnos seguidos) |
| Shishi Rendan | 25 | 32 | Combo aereo de taijutsu copiado de Rock Lee |
| Selo Amaldicoado (Nivel 1) | 20 | 0 | Perde 8 de vida. Por 3 turnos: +30% de dano, +10 de chakra por turno, 30% de chance de desviar (custa 2 de vida por turno). Marcas pretas tribais, sem Chidori roxo (esse fica para a transformacao total) |
| Selo Amaldicoado (Nivel 2) | 40 | 0 | Transformacao: perde 15 de vida. Por 3 turnos: +60% de dano, +15 de chakra por turno, 40% de chance de desviar (custa 3 de vida por turno). Transformacao completa, sem as marcas do Nivel 1: pele azul-acinzentada, cabelo azul-grisalho e duas maos gigantes saindo das costas. Libera o Chidori Sombrio |
| Chidori Sombrio (Nivel 2) | 35 | 44 | So aparece com o Nivel 2 ativo. Chidori negro e roxo. Fatality: igual ao do Chidori normal (perfura o peito e arranca o braco), mas com energia roxa e negra, buraco bem maior e muito mais sangue |
| Copiar Tecnica (Sharingan) | 8 | 0 | Gasta o turno. Copia a ultima tecnica do inimigo (so Rasengan ou Kage Bunshin) |
| Copia: Rasengan | 18 | 22 | 60% do chakra e 75% do dano do original (30 de chakra, 30 de dano). Uso unico |
| Copia: Kage Bunshin | 15 | 24 | 60% do chakra e 75% do dano do original (25 de chakra, 32 de dano). Uso unico |

Cada uma tem um fatality diferente: Tsukuyomi (Genjutsu), calcanhar que crava a cabeca na agua (Shishi Rendan), a espiral que tritura em fatias (Rasengan copiado) e seis clones que lancam kunais (Kage Bunshin copiado).
## Kawarimi no Jutsu (defesa)

O Kawarimi é um jutsu **básico de defesa**, disponível para todos os personagens (Sasuke e Naruto; os próximos também devem ter). Ele **não causa dano** nem contra-ataca:

- Custa **10 de chakra** e gasta o turno. Só pode ser usado **2 vezes por luta** por personagem (o menu mostra quantos restam).
- **Em segredo:** preparar não tem animação, banner nem marca na placa do adversário (é como Defender e Concentrar), para o inimigo não prever e não gastar um jutsu à toa. Só **você** vê a sua marca "変わり身" e a mensagem de quantos usos restam. Quando a IA prepara, aparece só "Naruto se prepara..." (ou "Sasuke se prepara..."), sem dizer o quê.
- O **próximo golpe que causaria dano** no personagem é **evitado por completo**: ele some numa nuvem de fumaça, um tronco leva o golpe e se parte, e ele volta ileso ao lugar de origem, com a mensagem "ESQUIVOU!" (aí o inimigo vê). Golpes que atordoam (Genjutsu) também falham quando são esquivados.
- Fica pronto até esse golpe chegar (só um por vez). Se o adversário usar golpes sem dano (Oiroke, Harem, transformação do selo), o Kawarimi continua pronto.
- Sasuke: comando **Kawarimi** (tecla 5 do menu principal). Naruto: **Kawarimi no Jutsu** no fim da lista. As IAs também usam, dentro do mesmo limite.
- O Kawarimi antigo (golpe com contra-ataque por trás e fatality de decapitação) foi **removido** do código; ele continua no histórico do Git (commit `ebb86cb` e anteriores).

## Regras de equilíbrio do RPG

- **Sem atordoamento em sequência:** depois de perder um turno por **Genjutsu Sharingan**, **Oiroke** ou **Harem no Jutsu**, o alvo fica imune a atordoamento até agir de novo (aparece "resistiu"). Antes dava para repetir o Genjutsu para sempre e o Naruto nunca jogava.
- **Chakra de verdade:** o chakra do Sasuke volta **+15 por turno** (era +20, o que deixava quase todo golpe de graça) e o do Naruto também **+15**. O Naruto controlado pela IA agora **só usa o que consegue pagar** e, sem chakra, concentra (+25). Concentrar dá +25 e Defender +10.
- **Gama Bunta:** só pode ser invocado **uma vez por luta**, fica com **28 de vida**, o Teppōdama causa **4** e os arremessos do Naruto em cima dele causam **2** (kunai) ou **2+1+1** (shuriken). A invocação custa 50 de chakra e causa 20.
- **Custos ajustados:** Shuriken Kage no Jutsu 12→**16** e Sōshūken 15→**17** de chakra (eram os golpes mais eficientes de longe).
- **IAs mais espertas:** o Sasuke da IA prefere golpes eficientes, usa o Genjutsu (quando o Naruto não está imune), se transforma com o Selo nível 2 e, com o sapo em campo ou o Naruto com pouca vida, vai no golpe mais forte para derrubá-lo logo.

`tools/balance-sim.js` simula milhares de lutas com esses números e várias estratégias (`node tools/balance-sim.js 5000`). Resultado antes → depois, em % de vitória: Genjutsu em sequência (Sasuke) 100 → 78; Harem repetido (Naruto) 99 → 32; Naruto invocando o sapo 100 → 56. Ponto ainda em aberto: jogar sempre o golpe mais forte (Amaterasu, Shishi, Chidori) ainda vence quase sempre em ~3 turnos; cortar esse dano faz o sapo voltar a dominar, então precisa de teste jogando antes de mexer.

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

### Kuchiyose no Jutsu (50 de chakra)
O Naruto morde o polegar e bate a mão no chão com o chakra vermelho da Kurama; o selo aparece e o **Gama Bunta** surge numa nuvem de fumaça, com o Naruto em cima da cabeça. O sapo (**uma vez por luta**) **fica em campo com 40 de vida**: os golpes do Sasuke acertam ele em vez do Naruto, e a cada turno ele dispara sozinho a bala de água (*Suiton: Teppōdama*, 6 de dano). Quando a vida acaba, ele some na fumaça e o Naruto volta ao chão.

### Layout de combate
O HUD agora tem placas de RPG com retrato, nome, **HP e chakra numéricos** (e a barra do sapo invocado, "SAPO") e os comandos ficam num painel com ícone, nome, descrição e custo de chakra. Com o Gama Bunta em campo ele vira o **alvo** dos golpes do Sasuke (o Naruto fica em pé na cabeça dele, sem apanhar), e os jutsus próprios do Naruto ficam bloqueados enquanto o sapo ataca sozinho.

Em cima do Gama Bunta o Naruto **não ataca de perto**: ele só pode arremessar **Kunai** (2 de dano) ou **Shuriken** (2+1+1 de dano) ficando na cabeça do sapo, ou usar Defender/Concentrar. Depois do turno dele, o sapo dispara o Teppōdama sozinho.

**Fatality do Gama Bunta:** se a bala de água zera a vida do Sasuke, o sapo salta e o esmaga com o corpo inteiro (câmera lenta no impacto), levanta, e o Sasuke fica achatado numa cratera de sangue; o Gama Bunta diz "Isso é o que dá mexer com o chefe do Monte Myōboku!".

O HUD (retratos, HP e chakra) agora fica numa faixa própria acima do cenário e não cobre mais a luta.

### Chakra da Kyūbi (Manto da Raposa)
Disponível uma vez por luta, com a vida do Naruto em **50 ou menos** (a IA usa sozinha quando chega a 40). O Naruto se curva, o chakra vermelho explode e um manto de chakra com orelhas e cauda de raposa o envolve, com os olhos vermelhos de pupila em fenda. Por **3 turnos** ele cura **+8 de vida** no fim de cada turno e os golpes dele causam **+35% de dano**.

No manto da Kyūbi o Naruto fica **de quatro**, como uma raposa, e o **Rasengan fica vermelho** (Rasengan da Kyūbi), infundido com o chakra dela.

O Naruto de quatro tem **vários quadros** (em `pixel/naruto-fours.js`): **agacha** com o corpo baixo e a cauda enrolada enquanto a esfera cresce, **corre em galope** (dois quadros alternando, com um salto no arranque e a cauda esticada para trás) e **golpeia em bote**, com o corpo esticado e a pata à frente, vibrando enquanto mói a esfera no Sasuke. O quadro é escolhido pela pose da animação (`fourKeyFor` em `js/03-sprites.js`) e o manto (orelhas e cauda) acompanha cada um.

**Fatality do Rasengan da Kyūbi:** se o Rasengan vermelho mata o Sasuke, a esfera cresce moendo o corpo inteiro, explode em vermelho e deixa um rombo maior, o corpo carbonizado com rachaduras em brasa e uma espiral queimada no chão; o Naruto volta de quatro e ruge.

## Progressão (nível, XP e árvore de habilidades)
- `js/00-data.js` guarda elementos, golpes, fichas e as árvores (`TREES`); o progresso (nível, XP, pontos, golpes aprendidos) fica em `PROG`, salvo no navegador (`rpgProgV1`).
- Nível máximo **50**; subir é lento (30 x nível x (1 + nível/12) de XP: 33 no nível 1, 550 no 10, 3150 no 30). A XP por batalha é pequena (cerca de 1/10 do necessário no nível do local) e cai bastante se você luta abaixo do seu nível (mínimo 10%); a derrota rende só 15%. Cada nível dá 1 ponto de habilidade.
- Cada golpe tem **raridade** (Comum, Incomum, Raro, Épico, Lendário): quanto mais rara, mais pontos custa (0, 2, 4, 7, 12) e mais nível exige (ex.: Genjutsu nv 8, Shishi nv 12, Sōshūken nv 16, Selo nv 28, Selo 2 nv 40).
- O botão "Árvore de habilidades" abre a tela (`js/17-skilltree.js`): cada golpe exige nível mínimo, golpes anteriores e pontos. O menu de comandos só mostra o que foi aprendido.

## Itens, equipamentos e mochila
- `js/00-data.js` define `ITEMS` (arma, corpo, acessório e consumíveis, com raridade) e a mochila `INV` (salva em `rpgInvV1`); `js/18-inventory.js` é a tela "Equipamentos".
- Bônus: vida máxima, ataque (+% de dano), defesa (-% de dano recebido) e dano de um elemento. Só o personagem que você controla recebe os bônus (`fightStats` em `js/12-state.js`).
- Consumíveis (pílulas e pergaminho) são usados pelo comando "Itens" na luta e gastam o turno. Trocar equipamento só é possível fora da luta.
- Vitória dá 100 ryo e 70% de chance de um item.

## Mapa da campanha
- `js/19-map.js` pinta o mapa por código (oceano, terras, regiões, caminhos) e abre ao carregar o jogo. Os locais, ligações e inimigos ficam em `NODES`/`EDGES` (`js/00-data.js`); o progresso fica em `CAMP` (`rpgCampV1`).
- Um local abre quando algum vizinho foi vencido. Ao escolher o local e quem vai lutar, a ficha viaja pelo caminho e a batalha começa com o cenário do local (`setScene` em `js/04-scenery.js`, por enquanto o Vale do Fim recolorido) e o inimigo do local (com seus elementos).
- Vitória marca o local, dá XP e ryo do local e volta ao mapa. Derrota também volta ao mapa, sem marcar o local.

### Simulador com elementos, níveis e itens
`tools/balance-sim.js` agora lê `js/00-data.js` (elementos, árvores, itens, locais). Modos novos: `node tools/balance-sim.js 3000 campanha` (cada local do mapa no nível recomendado), `niveis` (duelo por nível) e `itens` (equipamento e pílulas). Os modos antigos (`antes`, `atual`, `todos`) continuam iguais.

### Ajuste de equilíbrio com elementos, níveis e itens
Antes: a estratégia "sempre o golpe mais forte" do Sasuke vencia 99% em ~3 turnos (o Fogo vence o Vento, então Katon e Amaterasu davam +40%), a estratégia "Kuchiyose primeiro" do Naruto passava de 90% e as pílulas (30 de vida gastando o turno) quase não valiam a pena. Agora:
- Dano dos golpes do Sasuke -10%: Chidori 31, Katon 23, Shishi Rendan 32, Sōshūken 25, Shuriken Kage 27 (custos iguais). O **Amaterasu saiu do Sasuke criança**: continua guardado em `js/00-data.js` (`MOVES.amaterasu.futuro` e `TREES_FUTURO`), com a animação e o fatality no código, para o Sasuke adulto.
- Sapo: 28 de vida, invocação custa 50 e causa 20, Teppōdama 4, kunai 2 e shuriken 2+1+1; o Sasuke da IA derruba o sapo com o golpe mais barato que o mata.
- Pílulas: Soldado 50 de vida, Chakra 40, Pergaminho Médico 100. Equipamentos com bônus menores (ex.: Colete +5 de vida e -4% de dano).
- **O local não muda os status do inimigo** (o ambiente só dá o cenário). O que muda a vantagem ou desvantagem são os **elementos** do inimigo e do golpe; o nível do inimigo só define quais golpes ele tem.
Resultado: o Naruto jogando bem fica entre 60% e 80% nos locais; o Sasuke jogando com Chidori/Shishi continua fácil no Deserto e no Passo Nevado (93-97%), por isso a dificuldade por personagem fica para quando houver inimigos próprios. Rode `node tools/balance-sim.js 4000 campanha` para ver.

### Raridade dos itens
Os itens também têm raridade (Comum, Incomum, Raro, Épico, Lendário) e exigem nível para vestir: 1, 8, 16, 28 e 40. Há armas, corpo e acessórios de cada faixa (ex.: Katana da Anbu raro, Kusanagi épico, Kubikiribōchō lendário, Traje do Sábio lendário). Os drops dependem do local: o item só cai se o nível dele for até 8 acima do nível recomendado do local, e os raros são bem menos comuns. Golpes novos do Naruto (Rasengan Gigante e Rasenshuriken) estão guardados em `TREES_FUTURO` até terem animação.

### Kits iniciais e inimigos por nível
- No nível 1 o **Sasuke** só tem os ataques básicos (Kunai, Shuriken, Soco, Chute), o Kawarimi e a Bola de Fogo (Katon); o **Naruto** tem Soco, Chute, Kawarimi e o Kage Bunshin. Todo o resto é conquistado subindo de nível e gastando pontos: Genjutsu nv 6, Shishi nv 10, **Chidori nv 14 (Raro)**, Sōshūken nv 18, Shuriken Kage nv 22, Copiar nv 26, Selo nv 30...; Naruto: Oiroke nv 3, Uzumaki nv 8, Harem nv 10, **Rasengan nv 14 (Raro)**, Kamikaze nv 20, Kuchiyose nv 28, Kyūbi nv 40.
- O Naruto ganhou **Soco, Chute, Kunai (8 de dano) e Shuriken (4+4+4)** (as animações dos golpes do Sasuke, espelhadas), no menu de comandos e na árvore.
- Na campanha o inimigo só usa os golpes que o nível dele liberaria (`enemyKit` em `js/00-data.js`): o Genin Rival do Campo de Treino só tem o básico e o Clone das Sombras. Vida e ataque ficam no valor base, sem escala por local.
- O progresso salvo foi reiniciado (`rpgProgV2`) por causa da nova ordem.

Raridades ajustadas: Chidori e Rasengan **Raros** (4 pontos); Katon, Oiroke, Sōshūken e Shuriken Kage **Incomuns** (os golpes de shuriken do Sasuke são no máximo Incomum); Harem **Raro**.

### IA tática dos inimigos por local
A esperteza da IA cresce com o nível do local (`aiSmart` em `js/11-kyubi.js`: 0 no Campo de Treino, 1 no Vale do Fim, 0,5 fora da campanha) e **não muda os status** do inimigo, só as escolhas:
- **Vantagem elemental:** os golpes com vantagem contra os elementos do jogador ficam até ~10x mais prováveis e os com desvantagem quase somem (ex.: no Vale do Fim o Sasuke inimigo usa muito o Katon contra o Vento do Naruto e quase nunca o Chidori).
- **Finalização:** quando algum golpe mata, usa o mais barato que mata.
- **Kawarimi:** guarda para quando o jogador tem chakra para um golpe forte e usa mais cedo nos locais avançados (ainda no limite de 2 por luta).
- **Defender:** com pouca vida e sem Kawarimi pronto, se defende (o próximo dano cai pela metade). O Defender do Naruto agora vale também quando ele é o inimigo.
O `tools/balance-sim.js` ainda usa a IA antiga.

### Mapa em pixel art
O mapa da campanha (`js/18b-map-art.js`) agora é pintado em baixa resolução (1 pixel = 4 unidades) com paleta fixa, tramado ordenado e iluminação, e ampliado sem suavizar: oceano em faixas de profundidade com espuma e falésias, biomas (grama, floresta, deserto, neve, rochas, vila), pinheiros, cactos, montanhas com neve, dunas, rio, casas de Konoha, cachoeira e estátuas do Vale do Fim, barquinhos e bússola. Os locais, estradas e a ficha da equipe são desenhados por cima em blocos de 4 pixels.

## Sakura Haruno (Parte 1, jogável)

No mapa da campanha a equipe agora tem **Sasuke, Sakura e Naruto**; escolha quem vai lutar. A Sakura joga no lado esquerdo no lugar do Sasuke (o inimigo continua sendo o Naruto do local). Os sprites ficam em `pixel/sakura.js` (mesmas poses do Sasuke, com cabeça nova — cabelo rosa em chanel, fita vermelha, olhos verdes — e paleta de qipao vermelho e shorts verdes); `heroS` em `js/03-sprites.js` diz quem está no lado esquerdo.

Kit: Kunai, Shuriken, Soco, Chute, Kawarimi, Defender, Concentrar e Itens (iguais aos do Sasuke), mais:
- **Cura Médica** (12 de chakra): recupera 30 de vida; **Cura Intensiva** (30 de chakra, aprende com 4 pontos): recupera 65.
- **Shannarō! Soco de Chakra** (14 de chakra, 3 pontos, nível 6): 28 de dano, onda de choque e rachaduras no chão.
Afinidade: Terra (Yin). Tem árvore, nível, XP e equipamentos próprios. `js/20-sakura.js` guarda os golpes e efeitos dela.
- **Passiva, Dissipação de Genjutsu (Kai):** a Sakura cancela na hora ilusões inimigas (Oiroke e Harem do Naruto nunca a deixam sem turno).

## Kakashi Hatake (Parte 1, jogável, raridade Raro)

Quarto personagem da equipe do mapa; joga no lado esquerdo como o Sasuke e a Sakura. Sprites em `pixel/kakashi.js` (poses do Sasuke com colete jounin verde, mangas/calça azul-marinho, cabelo prateado, bandana sobre o olho esquerdo e máscara); código em `js/21-kakashi.js`. Afinidade Raio/Terra.
Kit: Kunai, Shuriken, Soco, Chute, Kawarimi e, na aba Jutsu, **Katon** (copiado), **Raikiri** (a animação e o fatality do Chidori, com texto próprio), **Genjutsu (Sharingan)** e **Ninja Copiador** (copia Rasengan/Kage Bunshin do inimigo).
- **Suiton (jutsus raros, liberados sozinhos pelo nível):** *Suijinheki* (Parede de Água, nível 15, 18 de chakra) absorve 80% do próximo dano; *Suiryūdan no Jutsu* (Dragão de Água, nível 25, 30 de chakra, 36 de dano) lança um dragão de água. Nós da árvore com `auto:1` entram sozinhos em `PROG` quando o nível chega (`autoLearn`), sem gastar pontos.
- **Fatality do Suiryūdan:** se o dragão mata, ele morde o Naruto e o ergue, uma bolha de água o prende e comprime até rachar e explodir numa onda enorme; os braços do Naruto são arrancados na explosão (meio braço cai na poça e uma mão voa para trás; os ombros ficam com cotos sangrando). Kakashi diz "Respire fundo. Pela última vez."
- **Doton: Tsuiga no Jutsu (nível 10, 22 de chakra, 18 de dano):** o Kakashi bate a palma no chão, uma rachadura corre até o inimigo e os cães ninja (Bull com coleira de espinhos, Pakkun, dois shibas, um cinza e um filhote, como na referência) saem da terra e o prendem: ele perde o próximo turno. **Fatality:** os cães arrastam o Naruto para dentro da terra, que se fecha sobre ele e deixa só uma mão ensanguentada para fora. Objetos sólidos (cães, monte de terra, braços) são desenhados na camada principal, porque a camada de FX recebe bloom e estoura cores escuras.
