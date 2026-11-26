---
title: "De bloco de notas a startup que se sustenta"
slug: "de-bloco-de-notas-a-startup"
description: "Como o Leap Notes saiu de um MVP de bloco de notas e virou produto de verdade, feito por estudantes da UECE e sem um real em anúncio."
category: "Produto"
tags: ["leap-notes", "startup", "produto", "crescimento-organico", "saas"]
order: 7
---

O primeiro commit do Leap Notes não tinha nada de medicina. Era login, cadastro e uma tabela de notas. Um bloco de notas com conta de usuário, basicamente. Hoje o mesmo repositório tem quase 3 mil commits, um editor com coedição em tempo real, um modelo 3D de anatomia, um assistente de IA e um checkout que a gente mesmo escreveu. No meio do caminho ninguém sentou e desenhou esse produto inteiro. Ele foi crescendo porque as pessoas usavam e pediam mais.

## O problema era de quem estava no plantão

O Leap Notes nasceu dentro da UECE. Eu sou o CTO e venho de Ciência da Computação. Meus sócios são estudantes de medicina, e isso muda tudo. Eles não precisavam de pesquisa de mercado pra saber qual era a dor: viviam ela toda semana.

A situação é mais ou menos essa. Interno ou residente no plantão, celular na mão, precisando lembrar a conduta de uma pneumonia, a dose de uma medicação, o jeito certo de escrever uma prescrição hospitalar. A informação existe, mas tá espalhada em PDF, print de WhatsApp, caderno, nota do celular sem formatação nenhuma. O que eles queriam era um lugar só, rápido, que funcionasse no navegador e no celular e que entendesse o jeito como médico escreve.

Então a primeira versão foi exatamente isso: um caderno. Notas, pastas, sincronização entre aparelhos. Nada que justificasse o nome "startup" ainda. Mas o caderno resolvia, e quem usava voltava. Foi aí que a gente percebeu que tinha algo.

## Como o caderno virou produto

A evolução veio quase toda de conversa com usuário e dos próprios sócios testando no plantão. Cada pedido que se repetia virava feature. Alguns marcos que eu lembro bem:

- **O editor.** Saímos de uma caixa de texto pra um editor rico sobre TipTap, com tabelas, imagens, atalhos de texto, histórico de versões e exportação pra PDF e DOCX. Depois veio a parte mais difícil: compartilhar pasta e nota, e editar a mesma nota junto com outra pessoa em tempo real.
- **Conteúdo clínico dentro do app.** Manual de condutas, bulário, calculadoras clínicas, CID-10 e CID-11. A ideia era que o usuário não precisasse sair do Leap pra consultar algo no meio de uma evolução.
- **Anatomia 3D.** Um modelo com 2.234 estruturas selecionáveis, rodando no navegador e no celular. É o tipo de coisa que ninguém espera achar num app de notas, e rende vídeo bom pras redes.
- **Questões.** Um feed de questões pra quem tá estudando pra prova e residência.
- **Leap AI.** Um assistente que conversa com as notas do próprio usuário. Ele busca nas notas antes de responder, monta quiz a partir de um tema e aceita ditado por voz.
- **Prescrições.** Essa começou como protótipo de um dos meus sócios. Ele escreveu os diagnósticos em Markdown, eu portei pra dentro do app com um script que transforma esses arquivos em dados. O médico copia o bloco, insere no cursor da nota ou gera um rascunho novo.

Tudo isso roda com o mesmo código no navegador e no Android, empacotado com Capacitor. No backend são 46 edge functions em TypeScript cuidando de webhook, upload, e-mail e IA. Time de engenharia: eu. Isso obriga a fazer de tudo um pouco e a escolher muito bem onde gastar tempo.

## Cobrar também é produto

Teve um momento em que o Leap deixou de ser projeto legal e virou negócio. Foi quando a gente precisou cobrar.

A primeira decisão foi o modelo freemium. O plano gratuito tem o caderno e boa parte das ferramentas. O Pro libera mais uso da IA e outras coisas. Pra controlar a cota do Leap AI eu fiz uma função atômica no banco que conta o uso por plano e, se der qualquer erro, nega em vez de liberar. Prefiro um usuário reclamando de bloqueio indevido do que uma conta de IA explodindo sem eu saber.

A segunda foi construir o checkout próprio. Seria mais simples mandar todo mundo pra uma página pronta de gateway, mas a gente queria controle de cupom, de plano, de Pix e de cartão dentro da nossa cara. Hoje o checkout atende cartão, Pix e assinatura, e tem um painel de observabilidade pros sócios acompanharem o que acontece sem precisar me perguntar.

Aprendi uma coisa nessa parte: pagamento é onde o software encosta no dinheiro de alguém, e qualquer bug ali vira mensagem no suporte no mesmo dia. Webhook que chega duas vezes, plano que precisa bater com o que o gateway diz, preço que mora em mais de um lugar. Hoje o preço tem uma fonte única no código e um teste que quebra se o checkout divergir dela. Parece exagero até a primeira vez que alguém paga o valor errado.

## Crescer sem pagar anúncio

A gente nunca investiu em tráfego pago. Todo o crescimento veio das redes sociais, com estratégia de conteúdo feita pelos sócios: vídeo mostrando a anatomia 3D, a busca, a nota sendo montada no plantão. O perfil do Leap passou de 10 mil seguidores assim. Do lado do produto, mais de 6.100 pessoas já acessaram a plataforma e já são mais de 23 mil notas clínicas salvas.

Crescimento orgânico tem uma vantagem que eu só entendi depois: quem chega já sabe o que tá procurando. Viu o vídeo, entendeu pra que serve, criou conta. E tem a desvantagem de não ter botão pra apertar quando você quer crescer mais rápido. Então o trabalho de engenharia acaba indo também pra parte de growth: links com UTM pra saber de qual post veio cada cadastro, programa de indicação, popups no Hub com teste A/B, campanha de e-mail, e um painel admin onde os sócios veem os números importantes logo na primeira tela, em linguagem de gestor e não de banco de dados.

Isso é uma das partes que eu mais gosto de fazer. O código só tem valor se alguém decide alguma coisa com base nele.

## Todo mundo aprendendo junto

Nenhum de nós tinha fundado uma empresa antes. Eu não sabia nada de medicina, eles não sabiam nada de deploy. A gente foi aprendendo um com o outro no processo, e segue aprendendo. Hoje eu sei o que é uma evolução clínica e por que um residente precisa copiar uma conduta em dois toques. Eles sabem por que eu não deixo subir mudança no banco sem testar antes e por que "é só um botão" quase nunca é só um botão.

Algumas lições que ficaram:

- **Feature boa costuma vir de quem usa.** As melhores ideias do Leap vieram dos sócios no plantão, não de mim olhando concorrente.
- **MVP feio que resolve vale mais que produto bonito que ninguém abre.** O bloco de notas do começo era bem simples, e foi ele que segurou os primeiros usuários.
- **Time enxuto exige disciplina.** Sendo o único dev, eu não tenho margem pra retrabalho. Teste automatizado, deploy por etapas e um ambiente de dev separado de produção é o que me deixa dormir.

Acho que somos um dos maiores cases de startup fundada por estudantes dentro da UECE, talvez o maior. Não tenho como provar isso com um ranking, é a minha impressão de quem tá lá dentro. O que eu sei é que o Leap começou como um bloco de notas feito por gente que precisava dele, e hoje é um produto que se paga, cresce sozinho e continua sendo feito por quem vive o problema.

Se quiser ver como ficou, tá em [leapnotes.app](https://leapnotes.app).
