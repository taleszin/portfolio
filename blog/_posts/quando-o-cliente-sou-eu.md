---
title: "Quando o cliente sou eu"
slug: "quando-o-cliente-sou-eu"
description: "Um tablet de 2014 que ia pro lixo, uma prancheta de basquete, um piano no celular. O que aprendi construindo coisas que só eu ia usar."
category: "Projetos pessoais"
tags: ["projetos pessoais", "android", "ia", "side projects"]
order: 9
---

Eu tinha um Multilaser M7s encostado. Tablet de 2014, 512 MB de RAM, dois núcleos a 1 GHz, Android 4.4. Travava pra fazer qualquer coisa. O destino natural dele era o lixo, e eu já tinha aceitado isso. Aí bateu aquela pergunta de quem programa: e se o problema fosse o software e não o aparelho?

Pouco mais de uma semana depois ele tinha um sistema operacional com o meu nome, uma prancheta tática de basquete e um piano. Nenhum desses projetos tem usuário além de mim. E foram os que mais me ensinaram nos últimos meses.

## Um sistema operacional pra um tablet que ninguém mais suporta

O M7s não tem nenhuma ROM alternativa no mundo. Nenhum fórum, nenhum XDA, nada. Se eu quisesse um sistema que travasse menos, ia ter que escrever o primeiro. Foi o que virou o Taleszin OS.

O começo foi engenharia reversa do firmware oficial: mapear a NAND e as partições do chip Rockchip RK3026, fazer backup completo em modo loader e aprender a gravar pelo Mac com `rkflashtool`, conferindo sha256 bloco a bloco. Tudo pelo cabo USB, sem abrir o aparelho. Quando o aparelho é de 2014 e não tem peça de reposição, você confere três vezes antes de gravar.

Depois veio a parte que realmente resolvia o travamento. Serviços em shell que sobem no boot: zRAM de 128 MB, KSM pra deduplicar memória, governador de CPU ajustado e uma sentinela que mata o processo certo antes do sistema morrer sem memória. Criei também uma caixa-preta que, no boot seguinte, explica por que a sessão anterior acabou. Isso mudou o jeito de depurar: em vez de "travou de novo", eu tinha um motivo escrito.

Teve uns achados que eu não ia encontrar em lugar nenhum. O sensor de bateria do kernel congela entre degraus de porcentagem, então o tablet desligava achando que tinha carga. A saída foi ler a tensão real direto do ADC e montar um vigia que reduz CPU e brilho antes do apagão. O botão liga/desliga não tinha reset, então passei a ler o evento cru do `evdev` e, se ele ficar pressionado por 8 segundos, o sistema faz sync, remonta como só-leitura e reinicia via `sysrq`:

```sh
# evdev cru: struct input_event de 16 bytes
set -- $(dd bs=16 count=1 <&3 | od -b)
# type 001 = EV_KEY · code 164 = KEY_POWER
[ "${10}${11}" = 001000 ] || continue
echo s > /proc/sysrq-trigger
echo u > /proc/sysrq-trigger
echo b > /proc/sysrq-trigger
```

Os apps também são meus: tela inicial, tema, diagnóstico estilo CPU-Z, um leitor de livros e um fliperama que abre jogos homebrew direto no emulador. Tudo em Java puro, compilado com `aapt2` e `d8`, sem Gradle. Num aparelho de 512 MB, cada megabyte conta, e a maioria desses apps tem menos de 120 KB. O código da ROM e dos apps tá no [meu GitHub](https://github.com/taleszin), com build reproduzível a partir do zip oficial e sem versionar firmware de ninguém.

## A prancheta e o scout do domingo

O primeiro app que coloquei no tablet nem era do sistema. Era uma prancheta.

Eu jogo basquete e handebol, e levo isso bem a sério. Prancheta de papel apaga mal, e os apps de prancheta que existem não rodam num Android 4.4. Então fiz a minha: quadra FIBA meia e inteira, quadra de 3x3, fichas de jogador, bola e cone que dá pra arrastar, setas de corte, passe, drible e bloqueio, e jogadas em passos que animam de um passo pro outro. Desenhado direto no Canvas, salva offline, umas duas mil linhas de Java.

A prancheta mostra a jogada. O scout é o que diz qual jogada desenhar. Antes de jogo importante, comecei a montar dossiê do adversário. No time de basquete em que jogo a Copa Cearense, isso virou um pipeline em Python: súmulas da federação, estatística de elenco, um índice técnico pra comparar atletas numa escala só. Parte disso virou o Basquete Cearense, um panorama público em React. Pra um adversário recente, analisei oito jogos dele antes de entrarmos em quadra.

O problema é que a liga mais forte do estado não publica tabela nem súmula. Mas transmite tudo no YouTube. Então os placares e lances saíam da transcrição da narração, cruzada com os vídeos.

E aqui veio o erro que mais me ensinou. A primeira versão de um desses documentos tinha clipes cortados automaticamente no instante em que o placar da transmissão mudava. Parecia ótimo. Só que o overlay do placar atrasa de 4 a 11 segundos em relação ao lance, e a amostragem era de 8 em 8 segundos, mais lenta que um contra-ataque. Resultado: um "contra-ataque" no documento era lance livre, outro clipe não mostrava nada, e uma legenda falava de duas cestas quando só aparecia uma. Joguei a versão fora. A regra que ficou: nenhum clipe entra no documento sem alguém ter olhado o que ele mostra.

Se fosse pra um cliente, talvez esse erro passasse. Como o cliente era eu, ia descobrir no pior lugar possível: no vestiário, explicando uma jogada que não existiu. No handebol, o scout da final pelo Triunfal, com diagramas de prancheta e quadro de ameaças, foi pro jogo que a gente ganhou e virou título.

## Um piano que cabe em 42 KB

O piano nasceu porque eu queria tocar um instrumento novo e o tablet já estava ali. A primeira versão era pra Taleszin OS e tinha que respeitar a mesma dieta: Java puro, uns 42 KB, cerca de 5 MB de RAM e 4% de CPU tocando.

O som foi a primeira briga. Eu queria usar amostras de piano gravado, mas o `SoundPool` do Android 4.4 recusa PCM acima de 1 MB. Então o som é sintetizado: um piano elétrico em FM, uma portadora na proporção 1:1 e um "sininho" em 14:1. Multitoque, deslizar o dedo troca de nota, pedal, nome das notas em Dó Ré Mi ou C D E.

Tocar sozinho cansa rápido, então veio o modo Músicas, estilo Guitar Hero: as notas caem sobre a tecla certa e esperam na linha, tem combo, estrela, recorde por música, velocidade de 30% a 150% e um botão que toca sozinho pra você ouvir antes. Erro faz a tecla ficar vermelha e não sai som, porque errado e alto desanima. Pra encher o acervo escrevi um conversor de MIDI pro formato do app. Hoje são 194 músicas em 9 categorias, de cantiga infantil a trilha de Zelda.

Quando ficou bom, quis no celular também. Um `TARGET=34` no script de build gerou o APK pra Android 14 sem eu reescrever o app. Depois veio a versão 2.0 com duas mãos, modo Aprender e Desafio, e um timbre mais encorpado.

## O que construir pra mim ensina que o trabalho não ensina

No trabalho, alguém decide o que é pronto. Tem prazo, tem prioridade, tem o "isso aqui já serve". Quando o cliente sou eu, não tem pra quem empurrar. Se o tablet trava, sou eu que fico com raiva. Se o scout erra, sou eu que passo vergonha. Esse feedback imediato e sem filtro me fez ficar mais exigente com o que considero terminado, inclusive no código dos outros projetos.

O outro lado é a liberdade de descer de nível. Nenhum produto meu de trabalho ia justificar ler `evdev` cru ou aprender a calcular a tensão da bateria num ADC. Mas foi aí que entendi de verdade o que é memória apertada e o que um serviço de boot faz. Isso volta pro dia a dia de formas que eu não previa.

E tem a IA, que mudou a conta. Os commits desses projetos têm o Claude como coautor, e as datas contam a história: o primeiro e o último commit da ROM ficam a dois dias de distância; a prancheta saiu em dois dias; o piano, da versão 1.0 à 1.4, também. Projeto desse tamanho, sozinho, à noite, antes levaria meses e provavelmente morreria na metade. Hoje cabe num fim de semana. A IA não decidiu a sentinela de memória nem percebeu que os clipes estavam mentindo. Isso fui eu, olhando o aparelho e o vídeo. O que ela tirou do caminho foi o trabalho braçal entre a ideia e o primeiro teste no hardware.

Tem mais coisa nessa linha: um app pessoal de finanças, scripts pra limpar o computador, e os jogos que fiz do zero, como o GEO SUMO, que saiu campeão da disciplina na UECE. Quase nada disso tem usuário além de mim. Tudo bem. O tablet que ia pro lixo ainda tá aqui.
