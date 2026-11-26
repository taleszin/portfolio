---
title: "Eu não conhecia os adversários, então fui estudar"
slug: "scout-tatico-no-esporte-universitario"
description: "Como a insegurança de entrar em quadra sem conhecer ninguém virou dossiê tático, prancheta no tablet e um título de handebol universitário."
category: "Projetos pessoais"
tags: ["esporte", "analise-tatica", "handebol", "basquete", "visualizacao"]
order: 12
publishedAt: "2026-07-29"
---

Jogo basquete e handebol universitário pela UECE; no handebol, de ponta. Antes de competição, uma coisa me incomodava: entrar em quadra sem saber quem era quem do outro lado. Quem arremessa de longe, quem só vai pra direita, quem corre o contra-ataque. No esporte universitário isso costuma ser descoberto no meio do jogo, depois do gol tomado.

Acabei dando uma hiperfocada nisso. Primeiro em estudar os adversários de verdade, depois o nosso próprio time, pra entender como os meus podiam se encaixar melhor. No caminho aprendi bastante coisa de tática, de análise de movimento e de vídeo. E, como sou dev, a vontade natural foi transformar isso em material visual, que qualquer um do time conseguisse entender em dois minutos no vestiário.

## Chegar com um plano

Talento sem leitura de jogo rende pouco numa competição curta. No torneio de handebol de 2026, decidi que o time ia chegar com plano. Montei um dossiê em HTML com as três equipes que a gente ia enfrentar, a ordem dos jogos e o que cada cenário de classificação exigia. O formato era todos contra todos num dia, final no dia seguinte, em quadra de futsal. Quadra menor comprime o espaço, a defesa recompõe mais rápido, e isso muda qual tipo de contra-ataque compensa.

O processo era simples e meio braçal. Assistir aos jogos dos outros, rever gravação quando tinha, anotar quem finaliza, de onde, e como cada time defende. Separar a impressão do fato: o próprio dossiê avisava que era análise com a informação disponível, e que o sistema defensivo de quem eu não tinha visto jogar seria confirmado ao vivo, nos primeiros ataques.

## Transformar observação em diagrama

A parte que mais me pegou foi a de comunicar. Um texto dizendo "fechem o meio" ninguém lembra no segundo tempo. Uma quadra desenhada com as bolinhas no lugar, sim.

Desenhei cada situação em SVG, sempre na mesma linguagem visual: roxo é a gente, cinza é o adversário, linha cheia é corrida, tracejado é passe, ciano é o que a gente quer que aconteça. A defesa 5:1 que a gente usava, a transição que sai do goleiro direto na ponta, o ataque posicional contra a defesa deles. E um quadro de ameaças, com quem merecia marcação de perto e qual era o plano pra cada um.

::: galeria
![Quadro de ameaças com cinco cards numerados, cada um com posição, característica e como parar](img/blog/scout-tatico-no-esporte-universitario/h-threats.webp "Quadro de ameaças do dossiê da final. Aqui com os nomes trocados pela posição.")
![Diagrama da defesa 5:1, cinco defensores fechando os 6 metros e um avançado pressionando o armador central](img/blog/scout-tatico-no-esporte-universitario/h-defesa51.webp "A nossa defesa 5:1: cinco fecham os 6 metros, o avançado pressiona o organizador.")
![Diagrama da transição, com o goleiro repondo direto na ponta que dispara pelo corredor lateral](img/blog/scout-tatico-no-esporte-universitario/h-transicao.webp "A transição: goleiro segura, repõe na ponta, e a ponta finaliza antes da defesa montar.")
![Diagrama do ataque posicional contra a defesa 5:1, com o pivô nas costas do avançado](img/blog/scout-tatico-no-esporte-universitario/h-posicional.webp "Ataque posicional contra o 5:1: o pivô se esconde nas costas do avançado.")
:::

Escrevi o dossiê com ajuda de IA, mas o trabalho de olhar o jogo e decidir o que importava era meu. Os rascunhos que a IA propunha ficavam genéricos demais até eu colocar o que tinha visto: os gols que a gente tomou na fase vieram de penetração dos armadores pelo centro, então a prioridade número um era blindar o meio. Esse tipo de detalhe só sai de quem estava em quadra.

## O flutuante

Estudar o próprio time foi o que mais rendeu. Eu sou ponta, perfil de velocidade e contra-ataque. Só que no ataque posicional a ponta muitas vezes fica parada no canto esperando uma bola que não vem. Olhando o nosso jogo, ficou claro que meu maior valor ali não era finalizar. Era abrir espaço pra quem finaliza melhor que eu.

Daí saiu o papel que a gente chamou de flutuante. Eu desço da ponta pro meio e levo meu marcador junto. O lado que eu esvaziei fica livre, e um dos nossos armadores ataca aquele espaço e recebe sozinho. Às vezes eu nem toco na bola.

![Animação de uma jogada de handebol: a ponta esquerda flutua pro meio puxando o marcador, abre espaço e o armador recebe e finaliza](video/blog-flutuante.mp4 "O flutuante em três tempos: puxar o marcador, abrir o espaço, servir o armador.")

Na final, contra o time de Medicina, tetracampeão e o time a ser batido havia quatro anos, joguei 25 dos 30 minutos e fiz 1 gol e 3 assistências. A gente já tinha vencido eles na fase de grupos por 15 a 12 e ganhou de novo na final. O título foi do time inteiro, de quem fechou o meio e de quem converteu. O que eu levo é ter visto o plano funcionando em quadra, do jeito que estava desenhado.

## Ferramentas que saíram disso

O hábito não ficou no handebol. Também jogo pelo Mamba, um time de basquete adulto, e fiz uma prancheta tática pro meu tablet antigo de Android 4.4, o mesmo que aparece no meu [portfólio](https://taleszin.github.io/portfolio/). É um app nativo em Java, desenhado direto no Canvas, com quadra inteira, meia quadra e 3x3. Dá pra montar uma jogada em passos e apertar play pra ver os jogadores se moverem, o que no intervalo vale mais que qualquer explicação falada.

Também fiz um shot chart com cara de fliperama: toca na quadra pra marcar arremesso certo ou errado, e ele separa por zona, calcula aproveitamento e pontos por arremesso e pinta as zonas quentes e frias. É o tipo de dado que tira a conversa do "acho que ele arremessa bem da esquerda" e coloca um número no lugar.

::: galeria
![Prancheta tática no tablet, quadra de basquete com jogadores numerados verdes e azuis e uma jogada em passos](img/blog/scout-tatico-no-esporte-universitario/prancheta-21-exemplo-play.webp "A prancheta no tablet, com uma jogada de quatro passos rodando.")
![Prancheta tática em modo 3x3, meia quadra com três jogadores de cada lado](img/blog/scout-tatico-no-esporte-universitario/prancheta-13-3x3.webp "Modo 3x3: meia quadra, placar de 1 e 2 pontos.")
![Shot chart em estilo arcade com zonas coloridas por aproveitamento e tabela por zona ao lado](img/blog/scout-tatico-no-esporte-universitario/bzin-main.webp "O shot chart, aqui com dados de exemplo.")
:::

O próximo alvo são os Jogos UECE, a competição maior da universidade. O método é o mesmo: estudar o adversário antes, desenhar o plano de um jeito que todo mundo entende, e conferir em quadra se ele funciona.
