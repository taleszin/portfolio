---
title: "A IAcema roda num modelo barato e cita a edição do jornal"
slug: "iacema-agente-sql-modelo-barato"
description: "Como montei a IA do Portal da História do Ceará: um modelo mini da OpenAI, ferramentas SQL bem desenhadas e um prompt que proíbe inventar fonte."
category: "IA"
tags: ["agentes", "tool use", "prompt engineering", "PHP", "MySQL"]
order: 5
---

Durante dois meses eu melhorei o prompt da IAcema e nenhuma dessas melhorias chegou ao visitante. Eu commitava, o deploy passava verde, as auditorias das conversas mostravam os mesmos vícios de antes, e eu concluía que o modelo era teimoso. Não era. Tinha um arquivo de configuração no servidor, fora do git, criado lá atrás pra guardar a chave da API, que também definia prompt, modelo e ferramentas. Ele carregava antes do arquivo versionado, e o versionado só definia cada constante se ela ainda não existisse. Resultado: a versão de produção era uma foto antiga, e tudo que eu escrevia depois era ignorado em silêncio.

Esse bug resume bem o que é fazer IA em produção com time enxuto. O difícil quase nunca é o modelo. É a fiação em volta dele.

## O que a IAcema é, e o que ela não é

A IAcema é a assistente do [Portal da História do Ceará](https://historiadoceara.com.br), o acervo digital que eu toco como tech lead em parceria com o Prof. Gildácio Sá. O acervo tem manchetes de jornais cearenses catalogadas, fatos históricos em ordem cronológica, autores, livros e revistas. A pergunta típica é "quando o Ceará aboliu a escravidão?" ou "me conta um crime antigo de Fortaleza", e a resposta boa é a que diz de qual jornal, de qual edição e de que data saiu aquilo.

Quando falo dela eu costumo dizer "SQL e RAG", e isso confunde, então vale separar. RAG, do jeito que a maioria das pessoas monta hoje, é vetorial: você quebra os documentos em pedaços, gera embedding de cada um, guarda num banco de vetores e, na hora da pergunta, puxa os pedaços mais parecidos semanticamente e cola no contexto. A IAcema também faz recuperação aumentada, só que por outro caminho. Não tem embedding nenhum. O modelo recebe uma lista de ferramentas, cada uma é uma consulta SQL parametrizada sobre o banco do acervo, e ele decide qual chamar e com quais argumentos. O banco devolve linhas com identificador de citação, e o modelo só pode citar o que veio nessas linhas.

Escolhi esse caminho por causa do dado. O acervo já é estruturado: manchete tem jornal, ano, mês, edição. Fato tem data. Pergunta histórica quase sempre carrega um recorte ("nos anos 50", "no Unitário", "em 1877"), e esse recorte é um `WHERE`, não uma similaridade de cosseno. Busca vetorial é ótima pra "ache algo parecido com isso". Pra "quantas manchetes sobre a seca saíram entre 1915 e 1919", ela é a ferramenta errada.

## As ferramentas são o produto

Hoje são mais de 16 ferramentas, todas com prepared statements. Tem `pesquisar_manchetes_direto`, `pesquisar_fatos`, `fatos_por_dia`, `hoje_na_historia`, `busca_cruzada`, `pesquisar_pessoa`, `manchetes_por_data`, `contar_registros` e por aí vai. Prepared statement ali não é detalhe de estilo: o argumento da ferramenta é escrito por um modelo de linguagem, que por sua vez leu o que o visitante digitou. Concatenar isso numa query seria entregar o banco pra qualquer um com criatividade.

O que mais aprendi é que a descrição da ferramenta é prompt. É ali que o modelo decide se chama ou não, e com que argumento. A mais cara do conjunto é a `montar_dossie`, que junta material pra contar uma história. A definição dela é mais ou menos assim:

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

Repara que a descrição diz quando não usar. Sem isso o modelo chama o dossiê pra tudo, a resposta fica lenta e cara, e uma pergunta seca de data vira um ensaio.

Outra coisa que só apareceu olhando conversa real: o jornal de 1960 não escrevia como a gente pergunta. Um visitante pediu um "crime sem solução", a IAcema buscou exatamente isso, achou zero, desistiu e inventou um caso vago. O jornal da época escrevia "crime misterioso", e com esse termo havia dezenas de manchetes. Virou regra no prompt: traduzir o conceito em palavra de época, tentar mais de um termo. E virou código também. A busca full-text passou a exigir todas as palavras significativas do termo, tirando stopword e tirando número puro, porque o ano mora nos metadados da edição, quase nunca no texto da manchete. Exigir "1961" dentro do texto matava a busca inteira.

## Modelo barato com boas ferramentas

A IAcema roda num modelo da faixa mini da OpenAI, com um nano de fallback. Já tentei o nano como principal e ele não aguenta: num loop de várias rodadas de ferramenta ele escolhe a tool errada ou encerra cedo. O mini aguenta. Um modelo grande também aguentaria, mas custaria bem mais por pergunta, e eu não preciso dele, porque o conhecimento não tá no modelo. Tá no banco.

Essa é a parte que eu mais defendo. Um modelo caro sozinho responde sobre a história do Ceará com fluência e confiança, e uma parte do que ele fala é inventada com cara de memória. Um modelo barato com boas ferramentas responde menos bonito, mas responde com o que existe, e quando não existe ele diz que o acervo não cobre. Pra um portal histórico, a segunda opção é a única aceitável. A inteligência que importa ali é saber o que perguntar ao banco, e isso cabe num mini.

Custo também é decisão de produto. Cada visitante tem um número de perguntas por dia, e a barra de uso no widget mostra uma porcentagem que anda conforme o que a pergunta custou de fato: quantas buscas exigiu e o tamanho da resposta. Uma pergunta seca gasta menos que um dossiê com várias consultas. Eu prefiro que o próprio produto ensine isso do que esconder o custo e descobrir na fatura.

E troca de modelo tem pegadinha. Numa dessas, o nome que estava commitado no código não existia na API. Não estourou em produção só porque o tal arquivo legado sobrescrevia o modelo também. Dois bugs que se anulavam. Na família nova ainda tive que mandar um parâmetro específico de raciocínio, porque com ele no padrão a API recusa function tools no endpoint que eu uso.

## Prompt que proíbe, não que pede

O prompt tá na versão `v7-antifabricacao`, e o nome diz muito. As primeiras versões pediam coisas: seja clara, cite fontes, seja simpática. As que funcionam proíbem coisas, com o erro real escrito do lado. Proibido abrir com "Para entender X, é preciso lembrar Y". Proibido parágrafo-Wikipedia. Proibido terminar com "Quer que eu...?", que no começo aparecia em quase metade das respostas. Proibido escrever título de livro que não veio de uma linha do catálogo. Proibido contar os itens da lista e chamar isso de total: a ferramenta devolve `total_no_acervo` e `amostra_exibida` separados, e o modelo tem que dizer os dois.

Tem também dois registros. O padrão é oráculo: pergunta factual, resposta seca, fato primeiro. Quando o visitante pede história, ela narra, mas só no turno em que o dossiê rodou e trouxe material. Sem material de ferramenta, sem narrativa. Junto disso veio uma memória de sessão que guarda os fatos já servidos naquela conversa, pra que "me conta outra" não traga a mesma história de novo.

A regra que mais mudou o resultado veio de um teste de estresse com conversa livre, imitando o jeito das pessoas reais. Pergunta dirigida sempre dispara ferramenta. Conversa solta, não: uma boa parte dos turnos rodava sem consultar nada, e praticamente todas as invenções graves estavam justamente nesses turnos. A correção foi um gate no servidor. Se nenhuma ferramenta rodou, a resposta não pode alegar ter achado manchete, contagem ou data com dia. Se alegar, o turno é bloqueado e marcado pra curadoria. Saudação, recusa e "o acervo não cobre isso" passam normalmente.

Pra fechar o buraco que me custou dois meses, toda conversa agora grava a versão do prompt que respondeu. Se um arquivo de config voltar a sombrear o prompt versionado, o painel mostra `config-legado` no mesmo dia. Hoje o arquivo do servidor guarda só a chave, e o resto vive no repositório, onde dá pra revisar, testar e reverter. Depois de mais de 1.650 conversas respondidas, é isso que eu levo: o modelo é a peça mais fácil de trocar, e o resto do sistema é que decide se ele vai mentir.
