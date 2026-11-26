---
title: "A IAcema roda num modelo barato e cita a edição do jornal"
slug: "iacema-agente-sql-modelo-barato"
description: "Como montei a IA do Portal da História do Ceará: um modelo mini da OpenAI, ferramentas SQL bem desenhadas e um prompt que proíbe inventar fonte."
category: "IA"
tags: ["agentes", "tool use", "prompt engineering", "PHP", "MySQL"]
order: 5
---

Durante dois meses eu melhorei o prompt da IAcema e nenhuma dessas melhorias chegou ao visitante. Eu commitava, o deploy passava verde, as auditorias das conversas mostravam os mesmos vícios, e eu concluía que o modelo era teimoso. Não era. Um arquivo de configuração no servidor, fora do git, criado pra guardar a chave da API, também definia prompt, modelo e ferramentas. Ele carregava antes do arquivo versionado, que só definia cada constante se ela ainda não existisse. Produção rodava uma foto antiga, e tudo que eu escrevia depois era ignorado em silêncio.

Fazer IA em produção com time enxuto é bem isso: o difícil quase nunca é o modelo, é a fiação em volta dele.

![Página inicial do Portal da História do Ceará com o botão redondo da IAcema no canto inferior direito](img/phc-home.webp "O botão da IAcema fica no canto de todas as páginas do portal.")

## SQL no lugar de embedding

A IAcema é a assistente do [Portal da História do Ceará](https://historiadoceara.com.br), o acervo que eu toco como tech lead em parceria com o Prof. Gildácio Sá: manchetes de jornais cearenses, fatos em ordem cronológica, autores, livros e revistas. A pergunta típica é "quando o Ceará aboliu a escravidão?", e a resposta boa diz de qual jornal, edição e data saiu aquilo.

RAG, do jeito que a maioria monta, é vetorial: quebra os documentos em pedaços, gera embedding, guarda num banco de vetores e puxa os pedaços mais parecidos. A IAcema faz recuperação por outro caminho. O modelo recebe uma lista de ferramentas, cada uma uma consulta SQL parametrizada sobre o acervo, e decide qual chamar e com quais argumentos. O banco devolve linhas com identificador de citação, e o modelo só pode citar o que veio nelas.

Escolhi assim por causa do dado. Manchete tem jornal, ano, mês e edição; fato tem data. Pergunta histórica quase sempre carrega um recorte ("nos anos 50", "no Unitário", "em 1877"), e recorte é um `WHERE`, não similaridade de cosseno. Busca vetorial é ótima pra "ache algo parecido com isso". Pra "quantas manchetes sobre a seca saíram entre 1915 e 1919", é a ferramenta errada.

::: celular
![IAcema no celular respondendo sobre a seca de 1958, com contagem de menções no acervo e números de citação no texto](img/blog/iacema-agente-sql-modelo-barato/resposta-seca-1958.webp "Pergunta sobre a seca de 1958: contagem do acervo e citação em cada frase.")
![Lista de fontes citadas pela IAcema, com jornal, ano e manchete de cada uma](img/blog/iacema-agente-sql-modelo-barato/fontes-citadas.webp "As fontes: cada número aponta pra uma manchete real, com jornal e ano.")
:::

## As ferramentas são o produto

São 16 ferramentas, todas com prepared statements: `pesquisar_manchetes_direto`, `pesquisar_fatos`, `hoje_na_historia`, `busca_cruzada`, `contar_registros` e por aí vai. Prepared statement ali não é estilo. O argumento é escrito por um modelo que leu o que o visitante digitou, e concatenar isso numa query seria entregar o banco pra qualquer um com criatividade.

A descrição da ferramenta é prompt. É ali que o modelo decide se chama e com que argumento. A mais cara é a `montar_dossie`, que junta material pra contar uma história:

```php
'name' => 'montar_dossie',
'description' => 'Reune MATERIA-PRIMA NARRATIVA completa sobre UM tema:
  fatos completos, linha do tempo de manchetes em ARCO (as mais antigas
  E as mais recentes) e trecho de artigo do acervo. USE SOMENTE quando
  o visitante pede narrativa. CUSTO ALTO. NAO use para pergunta factual
  de data, numero ou nome.',
'parameters' => [
    'type' => 'object',
    'properties' => [
        'tema'    => ['type' => 'string',
                      'description' => 'Nucleo do tema em 1-3 palavras'],
        'ano_min' => ['type' => 'integer'],
        'ano_max' => ['type' => 'integer'],
    ],
    'required' => ['tema'],
],
```

A descrição diz quando não usar. Sem isso o modelo chama o dossiê pra tudo, e uma pergunta seca de data vira um ensaio lento e caro.

Outra lição veio de conversa real. Um visitante pediu um "crime sem solução", a IAcema buscou exatamente isso, achou zero e inventou um caso vago. O jornal de 1960 escrevia "crime misterioso", e com esse termo havia dezenas de manchetes. Virou regra no prompt (traduzir o conceito em palavra de época, tentar mais de um termo) e virou código: a busca passou a exigir as palavras significativas do termo, sem stopword e sem número puro, porque o ano mora nos metadados da edição, quase nunca no texto da manchete.

## Modelo barato com boas ferramentas

A IAcema roda num modelo da faixa mini da OpenAI, com um nano de fallback. Testei o nano como principal e ele não aguenta: num loop de várias rodadas escolhe a ferramenta errada ou encerra cedo. Um modelo grande aguentaria, mas custaria bem mais por pergunta, e o conhecimento não tá no modelo. Tá no banco.

Um modelo caro sozinho fala da história do Ceará com fluência, e uma parte do que ele diz é inventada com cara de memória. Um modelo barato com boas ferramentas responde menos bonito, mas com o que existe, e quando não existe diz que o acervo não cobre. Pra um portal histórico, só a segunda opção serve.

Custo também é produto. Cada visitante tem um número de perguntas por dia, e a barra "Uso de hoje" anda conforme o que a pergunta custou de fato: quantas buscas exigiu e o tamanho da resposta. Prefiro que o produto ensine isso a descobrir na fatura.

## Prompt que proíbe

O prompt está na versão `v7-antifabricacao`. As primeiras versões pediam: seja clara, cite fontes. As que funcionam proíbem, com o erro real escrito do lado. Proibido abrir com "Para entender X, é preciso lembrar Y". Proibido terminar com "Quer que eu...?", que no começo aparecia em quase metade das respostas. Proibido escrever título de livro que não veio do catálogo. Proibido contar os itens da lista e chamar de total: a ferramenta devolve `total_no_acervo` e `amostra_exibida` separados, e o modelo tem que dizer os dois.

A regra que mais mudou o resultado veio de um teste de estresse com conversa livre. Pergunta dirigida sempre dispara ferramenta; conversa solta, não, e quase todas as invenções graves estavam nos turnos sem consulta. A correção foi um gate no servidor: se nenhuma ferramenta rodou, a resposta não pode alegar manchete, contagem ou data com dia. Se alegar, o turno é bloqueado e vai pra curadoria. Saudação, recusa e "o acervo não cobre isso" passam.


E pra fechar o buraco que me custou dois meses, toda conversa grava a versão do prompt que respondeu. Se um arquivo de config voltar a sombrear o versionado, o painel mostra `config-legado` no mesmo dia. O arquivo do servidor guarda só a chave; o resto vive no repositório, onde dá pra revisar, testar e reverter. Depois de mais de 1.650 conversas respondidas, o modelo continua sendo a peça mais fácil de trocar.
