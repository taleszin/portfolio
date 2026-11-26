---
title: "Aprendi PHP em menos de um mês, sem IA pra me salvar"
slug: "aprendi-php-em-um-mes-sem-ia"
description: "Meu primeiro estágio exigia uma linguagem que eu nunca tinha usado. Documentação, Stack Overflow e muito erro na tela me ensinaram mais que o PHP."
category: "Carreira"
tags: ["php", "estagio", "carreira", "aprendizado"]
order: 3
---

A vaga era de estagiário num sistema de gestão para laboratórios, o apLIS, e o código era em PHP. Eu nunca tinha escrito uma linha de PHP. O combinado, na prática, era simples: em menos de um mês eu precisava estar entregando coisa de verdade naquela base. Não tinha trilha de onboarding de três meses, não tinha curso pago pela empresa. Tinha o prazo e eu.

Eu vinha do PET de Computação da UECE, uma bolsa ótima pra quem tá no começo da graduação, mas que pra mim já tinha começado a ficar repetitiva. Saí porque não queria ficar estagnado. O estágio foi a primeira vez que alguém dependia do que eu escrevia, e foi ali que eu comecei a me sentir programador de fato.

## Um mês, três ferramentas

Hoje, se eu precisasse aprender uma linguagem nova em um mês, eu abriria um assistente de IA e pediria pra ele me explicar a base de código linha por linha. Naquela época isso não fazia parte da rotina de ninguém que eu conhecia. Então o método foi o clássico, e ele se resumia a três coisas.

A primeira era a documentação oficial. O [manual do PHP](https://www.php.net/manual/pt_BR/) tem uma coisa que eu demorei pra valorizar: cada função tem exemplos, e embaixo vem uma seção de comentários de usuários que às vezes explica melhor que o texto oficial. Eu lia a página da função, testava o exemplo, quebrava o exemplo de propósito pra ver o que acontecia.

A segunda era o Stack Overflow. Eu copiava a mensagem de erro, colava na busca e ia lendo respostas até achar uma que fizesse sentido pro meu caso. O aprendizado que ninguém te conta é que metade do trabalho é saber descrever o problema. Quando eu não conseguia achar resposta, quase sempre era porque eu ainda não sabia o nome do que estava errado.

A terceira era tentativa e erro, muita. `var_dump` em tudo, recarregar a página, ler o erro, mudar uma linha, recarregar de novo. É lento, é feio e funciona. Ainda funciona.

O que esse período me deu de mais valioso nem foi o PHP. Foi perder o medo de base de código desconhecida. Depois de passar por aquilo sem atalho, chegar num projeto novo e não entender nada nos primeiros dias virou estado normal.

## Por que o PHP virou minha linguagem preferida

Eu esperava aprender PHP por obrigação e largar quando desse. Aconteceu o contrário: ele virou a linguagem com que eu mais gostava de trabalhar, por dois motivos bem práticos.

O primeiro é a interação. No PHP clássico você escreve, salva, recarrega o navegador e vê o resultado. Não tem etapa de build, não tem compilador reclamando antes de você ver qualquer coisa. Pra quem tá aprendendo, esse ciclo curto entre mudar algo e ver o efeito é o que mantém a motivação viva.

O segundo é a facilidade de colocar uma página no ar. Um arquivo resolve:

```php
<?php
$nome = $_GET['nome'] ?? 'visitante';
?>
<h1>Olá, <?= htmlspecialchars($nome) ?></h1>
```

Sobe esse arquivo num servidor com PHP e você tem uma página dinâmica publicada. Sem configurar roteador, sem framework, sem pipeline. Quem começou com stack moderna às vezes acha isso primitivo, e em projeto grande realmente cobra seu preço. Mas pra um estudante que queria ver as próprias ideias funcionando na internet, era o caminho mais curto que existia. Depois do estágio eu acabei centrando boa parte do meu aprendizado nele justamente por isso.

## O que o estágio ensinou além do código

Fiquei cerca de um ano lá. O PHP foi a parte visível, mas o que mais mudou meu jeito de trabalhar foi o resto.

### Ser gerido

Na faculdade você entrega trabalho pro professor e acabou. No estágio tinha prioridade definida por outra pessoa, prazo que não era meu e tarefa que eu achava menos interessante mas que era a que importava naquela semana. Aprender a receber direção, perguntar quando não entendi e avisar cedo quando algo ia atrasar foi tão importante quanto aprender a sintaxe.

### Dividir código com outras pessoas

Era a primeira vez que eu mexia num código que não era só meu. Isso muda tudo: você não pode renomear uma coisa porque achou o nome feio, precisa entender por que alguém fez daquele jeito antes de mudar, e o seu código vai ser lido por gente que não tá na sua cabeça. Escrever pensando no colega que vai abrir aquele arquivo depois é hábito que eu levo até hoje.

### Suporte com prazo

Parte do trabalho era suporte com SLA. Quando chega um chamado com prazo de resposta, o problema deixa de ser abstrato. Tem alguém do outro lado esperando, e "funciona na minha máquina" não resolve nada. Isso me ensinou a investigar com método, reproduzir antes de mexer e explicar a solução em linguagem que quem abriu o chamado entende.

### Noção de produto

Também fiz prototipação no Figma, além de PHP e JavaScript. Desenhar a tela antes de codar me obrigou a pensar em quem ia usar aquilo, e não só em como implementar. Num sistema de gestão, uma tela confusa vira chamado de suporte, e chamado de suporte vira trabalho pra você mesmo. Essa conta fecha rápido na cabeça.

Por trás de tudo isso tem um padrão que se repetiu na minha vida inteira: time enxuto. Eu sempre trabalhei em equipes pequenas, e em equipe pequena você faz de tudo um pouco. Uma semana é código, na outra é atender suporte, na outra é desenhar tela. Pra quem tá começando isso pode assustar, mas pra mim foi o melhor jeito de entender como um software inteiro funciona, do banco até a pessoa que reclama do botão.

## O PHP ainda tá aqui

Depois que o contrato de estágio terminou, fiquei um tempo mais focado na faculdade. Aí veio o convite pra colaborar com o [Portal da História do Ceará](https://historiadoceara.com.br), e adivinha em que linguagem ele roda. PHP 8, com MySQL.

Abrindo o repositório do portal hoje, a estrutura ainda é aquela que eu aprendi a gostar no estágio: uma página, um arquivo. Tem `fato.php`, `acervos.php`, `biografia.php`, e uma pasta `api/` com endpoints como `get_fato.php`. O portal cresceu muito, ganhou busca no acervo, OCR de jornal antigo e uma assistente com IA, mas a base continua sendo PHP simples, que qualquer dev consegue abrir e entender em poucos minutos. Isso vale muito toda vez que alguém novo chega no projeto.

Hoje eu uso IA todo dia pra programar, e não tenho nenhuma nostalgia de ficar caçando resposta em fórum. Mas fico feliz de ter passado por aquele mês do jeito difícil. Foi ali que eu aprendi a ler documentação, a descrever um problema direito e a ficar confortável sem entender tudo de primeira. Essas coisas não vêm junto quando a resposta chega pronta, e são elas que me deixam conferir se a resposta que a IA me deu está certa.
