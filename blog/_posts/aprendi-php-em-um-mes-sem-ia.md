---
title: "Aprendi PHP em menos de um mês, sem IA pra me salvar"
slug: "aprendi-php-em-um-mes-sem-ia"
description: "Meu primeiro estágio exigia uma linguagem que eu nunca tinha usado. Documentação, Stack Overflow e muito erro na tela me ensinaram mais que o PHP."
category: "Carreira"
tags: ["php", "estagio", "carreira", "aprendizado"]
order: 3
publishedAt: "2026-03-05"
cover: "none"
---

A vaga era de estagiário num sistema de gestão para laboratórios, o apLIS, e o código era em PHP. Eu nunca tinha escrito uma linha de PHP. O combinado, na prática, era: em menos de um mês eu precisava estar entregando coisa de verdade naquela base. Sem trilha de onboarding de três meses, sem curso pago pela empresa. Tinha o prazo e eu.

Eu vinha do PET Computação da UECE, que já tinha começado a ficar repetitivo pra mim. O estágio foi a primeira vez que alguém dependia do que eu escrevia.

## Um mês, três ferramentas

Hoje, se eu precisasse aprender uma linguagem em um mês, abriria um assistente de IA e pediria pra ele me explicar a base de código linha por linha. Naquela época isso não fazia parte da rotina de ninguém que eu conhecia, então o método foi o clássico.

Primeiro, a documentação oficial. O [manual do PHP](https://www.php.net/manual/pt_BR/) tem uma coisa que demorei pra valorizar: cada função vem com exemplos, e embaixo tem comentários de usuários que às vezes explicam melhor que o texto oficial. Eu lia a página, testava o exemplo e quebrava ele de propósito pra ver o que acontecia.

Segundo, o Stack Overflow. Copiava a mensagem de erro, colava na busca e lia respostas até achar uma que servisse pro meu caso. Metade do trabalho era saber descrever o problema. Quando eu não achava resposta, quase sempre era porque ainda não sabia o nome do que estava errado.

Terceiro, tentativa e erro. `var_dump` em tudo, recarregar a página, ler o erro, mudar uma linha, recarregar de novo. É lento, é feio e funciona até hoje.

O que esse mês me deu de mais valioso foi perder o medo de base de código desconhecida. Chegar num projeto novo e não entender nada nos primeiros dias virou estado normal.

## Por que o PHP virou minha linguagem preferida

Eu esperava aprender por obrigação e largar quando desse. Aconteceu o contrário, por dois motivos práticos.

O primeiro é o ciclo curto. No PHP clássico você escreve, salva, recarrega o navegador e vê o resultado. Sem build, sem compilador reclamando antes. Pra quem tá aprendendo, ver o efeito da mudança na hora é o que mantém a motivação.

O segundo é colocar uma página no ar. Um arquivo resolve:

```php
<?php
$nome = $_GET['nome'] ?? 'visitante';
?>
<h1>Olá, <?= htmlspecialchars($nome) ?></h1>
```

Sobe isso num servidor com PHP e você tem uma página dinâmica publicada, sem roteador, framework ou pipeline. Em projeto grande isso cobra seu preço, mas pra um estudante que queria ver as próprias ideias funcionando na internet era o caminho mais curto que existia.

## O que o estágio ensinou além do código

Fiquei cerca de um ano lá, e o PHP foi só a parte visível.

**Ser gerido.** Na faculdade você entrega pro professor e acabou. No estágio a prioridade era definida por outra pessoa, e às vezes a tarefa que importava naquela semana era a que eu achava menos interessante. Aprender a receber direção, perguntar quando não entendi e avisar cedo quando algo ia atrasar pesou tanto quanto a sintaxe.

**Dividir código.** Era a primeira vez que eu mexia num código que não era só meu. Não dá pra renomear algo porque achou o nome feio; você precisa entender por que alguém fez daquele jeito antes de mudar. Escrever pensando no colega que vai abrir o arquivo depois é hábito que levo até hoje.

**Suporte com SLA.** Quando chega um chamado com prazo de resposta, tem alguém do outro lado esperando, e "funciona na minha máquina" não resolve nada. Aprendi a reproduzir antes de mexer e a explicar a solução numa linguagem que quem abriu o chamado entende.

**Produto.** Também fiz prototipação no Figma. Desenhar a tela antes de codar me obrigou a pensar em quem ia usar. Num sistema de gestão, tela confusa vira chamado de suporte, e chamado de suporte vira trabalho pra você mesmo.

Por trás disso tudo tinha um time enxuto, como em quase todo lugar onde trabalhei. Uma semana era código, na outra suporte, na outra desenho de tela. Foi o melhor jeito de entender um software inteiro, do banco até a pessoa que reclama do botão.

## O PHP ainda tá aqui

Depois que o contrato terminou, fiquei um tempo mais focado na faculdade. Aí veio o convite pra colaborar com o [Portal da História do Ceará](https://historiadoceara.com.br), que roda em PHP 8 com MySQL.

![Página inicial do Portal da História do Ceará, com um mapa antigo da Serra da Ibiapaba ao fundo e o menu de jornais, fatos, biografias e livros](img/phc-home.webp "O Portal da História do Ceará: PHP 8 e MySQL, uma página por arquivo.")

A estrutura do repositório ainda é a que aprendi a gostar no estágio: uma página, um arquivo. Tem `fato.php`, `acervos.php`, `biografia.php`, e uma pasta `api/` com endpoints como `get_fato.php`. O portal ganhou busca no acervo, OCR de jornal antigo e uma assistente com IA, mas a base continua sendo PHP simples, que qualquer dev abre e entende em poucos minutos. Isso vale muito toda vez que alguém novo chega no projeto.

Hoje uso IA todo dia pra programar e não tenho nostalgia nenhuma de caçar resposta em fórum. Mas aquele mês do jeito difícil me ensinou a ler documentação, descrever um problema direito e ficar confortável sem entender tudo de primeira. É isso que me deixa conferir se a resposta que a IA me deu está certa.
