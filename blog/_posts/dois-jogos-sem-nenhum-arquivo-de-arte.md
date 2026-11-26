---
title: "Dois jogos sem um único arquivo de arte"
slug: "dois-jogos-sem-nenhum-arquivo-de-arte"
description: "Como fiz o FUELMANIA e o GEO SUMO com arte, som e física escritos em código, e o que essa regra me deu de graça: um jogo que dá pra medir."
category: "Engenharia"
tags: ["game dev", "webgl", "three.js", "áudio procedural", "física"]
order: 13
publishedAt: "2026-09-16"
cover: "img/fuel-day.webp"
---

O FUELMANIA é um posto de gasolina de beira de estrada com cidade, carros, chuva, poeira de vento, eclipse e disco voador. O jogo não carrega uma imagem de arte sequer. O GEO SUMO, uma briga de formas geométricas numa arena flutuante, também não. Tudo o que aparece e tudo o que toca nos dois sai de código: geometria montada em tempo de execução, shader, oscilador da Web Audio API.

![Ciclo de dia e noite, clima e movimento no pátio do FUELMANIA](video/fuelmania-loop.mp4 "FUELMANIA rodando: nada disso vem de arquivo de imagem.")

## A regra

Se dá pra escrever, não vira arquivo. O primeiro ganho é peso. No começo do FUELMANIA, medi o build inteiro: uns 150 KB gzip. Nada de tela de "baixando recursos".

O ganho maior é outro: quando a arte é parâmetro, mudar o humor do jogo é mudar um número. E o jogo inteiro fica coerente porque tudo puxa da mesma fonte. Isso vale pra cor, pra luz e, principalmente, pra som.

## GEO SUMO: física que dá pra sentir

O GEO SUMO saiu em quatro dias de fevereiro, como trabalho de disciplina na UECE, e acabou campeão na categoria de jogos 3D. É WebGL 1 cru com GLSL, sem engine, com `gl-matrix` pra álgebra e só. O renderizador, a câmera, o input de toque e a física foram escritos à mão.

A mecânica é a do Smash: não existe barra de vida. O dano acumula em porcentagem e aumenta o quanto você voa no próximo golpe. A conta é simples de propósito:

```javascript
baseKnockback = punchPower * (1 + defender.damage / 100)
hitstun = min(30, baseDuration * (1 + damage / 200)) * difficultyMultiplier
```

O knockback sai 82% na horizontal, porque o objetivo é jogar o outro pra fora da arena, não pro alto. O hitstun cresce com o dano mas tem teto, senão o combo vira infinito. A dificuldade mexe no tempo de reação da IA e também nesses multiplicadores: no fácil o knockback é multiplicado por 1,5 e o atrito é alto; no difícil cai pra 0,7, com atrito baixo e hitstun maior.

::: galeria
![Dois lutadores em forma de cubo se empurrando na arena circular neon](img/geosumo-fight.webp "A arena: quem sai do círculo perde uma vida.")
![Tela de criação de lutador com opções de forma, olhos, boca e dificuldade](img/geosumo-menu.webp "Forma, cor, olhos e boca, tudo desenhado em shader.")
:::

## Som afinado por uma escala só

Os dois jogos têm a mesma ideia no áudio: nenhum som toca fora de uma escala pentatônica. Pentatônica não tem os graus de atrito, então qualquer combinação de notas soa consonante. Dá pra disparar vinte efeitos ao mesmo tempo sem virar barulho.

No GEO SUMO é Ré menor pentatônica. Até andar toca nota: cada direção do WASD é um grau da escala, com cooldown pra não poluir. A trilha tem seis camadas que entram conforme a intensidade da luta, num relógio de 120 BPM, e o combate conversa com ela: soco no tempo da batida dá 25% a mais de dano e knockback, com um power chord de recompensa.

No FUELMANIA a escala é Dó maior pentatônica em entonação justa, e a tônica não é fixa. Ela escorrega de Dó, de dia, pra Lá, a relativa menor, conforme a noite cai. Trilha, caixa registradora e combo leem a mesma função `getRoot()`, então mudam de humor juntos e nunca desafinam entre si. O comentário no topo do arquivo da trilha resume a filosofia: silêncio é instrumento. Madrugada chuvosa e vazia é quase silêncio; meio-dia lotado é a trilha inteira.

Uma regra técnica que me salvou: no caminho de áudio não entra `Math.random`, `Date` nem `performance.now`. A variação musical vem de um gerador congruencial com semente, e as notas são agendadas à frente no relógio do `AudioContext`. Sem isso, a música tropeça sempre que o frame atrasa.

## FUELMANIA: arte que é código

Dois exemplos do que "arte em código" quer dizer na prática.

O mundo é redondo, no estilo Animal Crossing. Um trecho de vertex shader afunda a geometria conforme ela se afasta do centro: `y -= max(0, dist - 24)² / (2·80)`. Até raio 24 o mundo é perfeitamente plano, e é ali que fica o posto inteiro. Assim o clique e o posicionamento de construções não precisam saber que existe curva. Na borda da grama a queda chega a 10 unidades e o chão vira horizonte dentro da neblina.

A frota é brasileira e procedural. São cinco carros "heróis" (Fusca, Brasília, Kombi, Uno e Opala) com o corpo extrudado do perfil lateral, e nove carros de fundo feitos de caixa simples de propósito: o contraste faz os icônicos saltarem. A Brasília sai amarela em três de cada cinco, porque a piada é essa. O Uno raro vem com escada no teto. As geometrias fundidas nascem uma vez no boot; cada carro novo é só um `new Mesh` em cima do cache.

::: galeria
![Pátio do posto de dia, com bombas, loja, árvores e bandeiras](img/fuel-day.webp "Dia limpo no pátio.")
![O mesmo pátio sob tempestade, com nuvens escuras e chuva](img/fuel-storm.webp "Mesmo pátio, clima de tempestade: luz, céu e som mudam juntos.")
![Carros na fila das bombas com painel de depuração mostrando o estado da fila](img/fuel-advanced.webp "Fila de atendimento com o painel de depuração ligado.")
:::

## O que a regra me deu de graça: um jogo que dá pra medir

Como tudo é código, o jogo inteiro roda sem tela. Antes de mostrar pra alguém, escrevi bots que dirigem o build real pelo navegador: avançam a simulação no mesmo passo fixo do jogo, com `Math.random` semeado pra cada rodada ser repetível, e perfis diferentes de jogador (casual, apressado, distraído).

O resultado doeu. Um jogador dedicado esgotava tudo o que dava pra comprar em 22 minutos e meio, umas quatro vezes mais rápido do que eu tinha planejado. E a logística punia quem jogava bem. Bot não sente tédio, então isso mede economia e ritmo, não diversão, mas é o tipo de coisa que eu só descobriria semanas depois com gente.

Depois veio gente de verdade: mandei o link pra umas seis pessoas num domingo à noite. Minha primeira leitura dos dados foi que o tutorial falhava. Estava errada. Todo mundo que entrou no jogo atendeu pelo menos um carro. Quem não jogou nunca passou da porta, e uma das barreiras da porta era minha: uma tela preta de "toque para começar", pra liberar o áudio no navegador, que eu tinha colocado no ar poucas horas antes. Três dias depois ela saiu, e o jogo voltou a abrir direto.

::: celular
![Pátio do FUELMANIA na tela de um celular, com o posto no centro e botões no topo](img/fuel-mobile.webp "No celular: mesma build, empacotada pra Android com Capacitor.")
:::

Dá pra jogar os dois no navegador: o [FUELMANIA](https://bomba-cheia.vercel.app) e o [GEO SUMO](https://taleszin.github.io/geosumo/), que tem o [código aberto](https://github.com/taleszin/geosumo).
