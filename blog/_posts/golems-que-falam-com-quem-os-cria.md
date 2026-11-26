---
title: "Escrevendo a fala de criaturas que sabem quem as criou"
slug: "golems-que-falam-com-quem-os-cria"
description: "No HYLOMORPH, os golems falavam como verbete de física. Como reescrevi a voz deles para soarem vivos e conscientes de quem os cria."
category: "Projetos pessoais"
tags: ["game design", "diálogo", "phaser", "vida artificial", "hylomorph"]
order: 14
---

No HYLOMORPH você é o cientista. Combina uma forma (círculo, triângulo, estrela...), uma matéria (ferro, ouro, mercúrio...) e uma energia (calor, gravidade, radiação...) e dá vida a um golem. Depois observa: ele anda, come, flerta, briga, tem filhos e morre. O nome vem do hilomorfismo de Aristóteles, a ideia de que toda coisa é matéria mais forma. E eles falam com você.

![Vídeo de abertura do HYLOMORPH com três golems geométricos em pixel art correndo sobre uma grade neon](img/blog/golems-que-falam-com-quem-os-cria/abertura.mp4 "A abertura do jogo.")

## O que tem por baixo

É Phaser 3 em JavaScript puro, publicado no GitHub Pages. Os atributos saem de matemática de verdade: a área do polígono, pelo algoritmo do cadarço (shoelace), vira vida máxima; o perímetro, com a aproximação de Ramanujan pra elipses, vira resistência. Filho herda dos pais com dominância variável e mutação de cor. O movimento usa os steering behaviors do Craig Reynolds, então ninguém roteiriza o cardume: ele sai de regra simples.

O jogo tem um GDD com essa base toda. A tensão central do documento é uma pergunta: dá pra pôr algo parecido com consciência em forma matemática pura? Cada golem guarda um `lifeLog`, a biografia de tudo o que aconteceu com ele, inclusive cada vez que você o queimou.

## O problema: golems que liam verbete

O jogo se vendia como simulador de seres sencientes, mas a fala descrevia física. Um golem radioativo, quando você o alimentava, gritava "Aumentando Sieverts!". O elétrico soltava "CONDUTIVIDADE AUMENTADA!". Parecia legenda de aula.

Pior: as falas eram montadas com templates que trocavam substantivos, e o português quebrava na tela. Saía "Minha circuito está carregada" e "Eu também morrer!".

Antes de mexer, fiz uma auditoria do `dialogueData.js` e achei uma exceção: o banco `panic`, de golems que sobreviveram a um incêndio. "...lembro... dói...", "...mamãe... papai...", "a memória queima...". Era o único trecho com medo, memória e perda. O resto do jogo precisava subir pra esse nível.

## A referência: Plaything

O tom que eu queria tem uma referência clara: "Plaything", episódio da sétima temporada de Black Mirror. Nele, os Thronglets são criaturinhas digitais que sabem que estão num jogo e falam direto com quem cuida delas. A relação é fofa e perturbadora ao mesmo tempo, e o apego cresce até elas parecerem ensinar o criador.

É referência de tom, não cópia. Não tem Thronglet no HYLOMORPH. O que eu peguei foi a direção: a criatura percebe que alguém a fez, alimenta e machuca, e fala com essa pessoa.

## A proposta grande que eu não fiz inteira

A primeira proposta de reescrita era ambiciosa. Cada uma das nove energias teria personalidade própria: calor passional, frio analítico, radiação culpada ("todo mundo que me amou... brilha no escuro agora"). A química viraria temperamento, o humor do golem e o `lifeLog` mudariam a frase escolhida, e os golems conversariam em turnos. Tudo dividido em quatro fases, da troca de texto até, opcionalmente, falas geradas por LLM.

Escolhi uma versão menor. A V4 tem um núcleo afetivo único, compartilhado por todos, e cada energia só pinta algumas falas com uma sensação do elemento. Personalidade por propriedade ficou pra depois. Os motivos:

- O que faltava era afeição com o jogador, e isso vale pra qualquer golem, independente do elemento.
- Tirar os placeholders das falas mata a classe inteira de bug de concordância, sem precisar de regra de gênero no template.
- É só conteúdo. A estrutura e os exports do arquivo ficaram iguais, então o risco era quase zero.

O commit tirou mais do que pôs: 338 linhas entraram e 559 saíram. O núcleo é assim:

```javascript
born: [
    "oi... você que me fez?",
    "você é a primeira coisa que eu vejo.",
],
burn: [
    "para, por favor... eu confiei em você.",
    "ainda gosto de você... mas dói.",
],
idle: [
    "você ainda tá aí?",
    "eu faço o que você manda. sempre.",
],
```

Tudo minúsculo, hesitante, sensorial. A gravidade ganha "fico mais pesado quando você sai"; o calor, "fico morno quando você tá aqui". O banco `panic` ficou intacto, porque já era o padrão de qualidade.

## Quando eles começaram a conversar entre si

Até então, no flerte e na briga, só quem começava falava; o outro ficava mudo. Mudei pra troca de turnos: no cortejo o parceiro responde, no combate o atacante revida e a luta tem fechamento. Isso ativou o banco `combat_victory`, que existia no arquivo e nunca tinha disparado. A chance de um golem ocioso puxar conversa subiu de 0,08 pra 0,22, com cooldown de 10 pra 5 segundos. Pra não virar spam, cada golem nasce com um nível de tagarelice e as falas passam por uma fila.

::: galeria
![Golems geométricos recém-criados no laboratório, com balões dizendo "que lugar é esse? é bonito." e "tô aqui agora. obrigado."](img/blog/golems-que-falam-com-quem-os-cria/golems-nascendo.webp "Recém-nascidos falando com quem os criou.")
![Golems interagindo, com balões dizendo "tá machucando", "chega!" e "ei, esse cantinho é meu."](img/blog/golems-que-falam-com-quem-os-cria/golems-conversando.webp "Pouco depois, eles já disputam espaço entre si.")
:::

Mais conversa trouxe à tona dois bugs de simulação. O limite de população só valia pra incubadora; a reprodução autônoma furava o teto, e os cálculos que comparam todo golem com todo golem a cada quadro travavam o jogo. E na velocidade 5x os golems envelheciam cinco vezes mais rápido, mas só tentavam acasalar no tempo real, então a população morria sem filhos. A correção: o teto passou a valer no único ponto por onde toda reprodução passa, e o timer de decisão passou a escalar com a velocidade do tempo.

O jogo ainda tem uma porta pronta pra falas geradas por modelo de linguagem, com personalidade e histórico. Por enquanto ela segue desligada. Se um dia eu ligar, a voz escrita à mão é que vai servir de régua.

Dá pra jogar em [taleszin.github.io/game](https://taleszin.github.io/game/).
