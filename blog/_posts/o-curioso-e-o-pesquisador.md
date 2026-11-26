---
title: "O curioso, o pesquisador e quem procura a própria família"
slug: "o-curioso-e-o-pesquisador"
description: "Como públicos muito diferentes mudaram a busca, a IA e os painéis do Portal da História do Ceará, e por que medir veio antes de redesenhar."
category: "Produto"
tags: ["produto", "portal-da-historia-do-ceara", "busca", "metricas", "ux"]
order: 6
---

Uma das perguntas mais comuns que chegam à IAcema, a assistente do [Portal da História do Ceará](https://historiadoceara.com.br), tem duas palavras: `Barro vermelho`. Sem verbo, sem contexto. A pessoa digita, olha o que voltou e vai embora. Na mesma semana, outra pessoa passa a madrugada perguntando sobre cangaço, corrige a IA quando ela erra uma data e sai com dezenas de manchetes de 1927 sobre Lampião. As duas usam a mesma caixa de texto, e as duas querem coisas que não têm quase nada a ver.

Esse é o problema de produto do portal. O acervo é um só: 2,5 milhões de manchetes, 250 mil edições de 133 jornais, fatos, biografias, livros e revistas. Quem chega é muita gente diferente. O curioso que viu um reel. O pesquisador que precisa da edição exata pra citar no trabalho. O professor montando aula sobre a seca. E, talvez o grupo que mais me pega, gente procurando a história da própria família ou da rua onde cresceu.

## Dois públicos, dois gargalos

Por um tempo eu olhei demais pro usuário intenso. Teve uma pesquisa sobre a história de um clube social que rendeu centenas de perguntas, até a pessoa desistir e ir pro formulário de contato. Dá vontade de construir tudo pra esse caso: exportação, filtros, resultado completo.

Quando fui pros dados, o meio da distribuição era outro. A pergunta mediana tinha pouco mais de 30 caracteres, uma fatia grande tinha três palavras ou menos, e a maioria das pessoas usava a IAcema num único dia. Comportamento de caixa de busca, não de conversa. Essa pessoa não desistiu por falta de CSV. Ela nunca chegou perto disso.

Então separei em dois gargalos:

- a maioria, casual, de sessão única, esbarra em descoberta e clareza, e isso é problema de UX;
- a minoria intensa, o pesquisador temático, esbarra em evidência e volume de resultado, e isso é problema de capacidade.

A ordem de ataque saiu dali. Volume primeiro, porque é onde está a maior parte das pessoas. E várias coisas que pareciam features novas já estavam no código, só desconectadas. O visualizador de imagem com zoom existia, mas não carregava nas páginas onde o chat vive. A busca por nome de pessoa era o tipo de pergunta com mais acerto de citação e não aparecia em lugar nenhum da interface. Antes de desenhar coisa nova, ligar o que já estava pago.

## A busca tem que falar a língua de 1930

O pesquisador quer exatidão, o curioso quer achar alguma coisa. Os dois quebram no mesmo ponto: o jornal antigo não escreve como a gente fala hoje.

O caso que me ensinou isso foi uma pessoa pedindo um "crime sem solução". A IA buscou o conceito literal, achou zero, desistiu e inventou um nome vago. Só que os jornais da época escreviam "crime misterioso", e com esse termo tinha dezenas de manchetes. A correção foi uma regra no prompt: traduzir o conceito pra palavra de época, tentar pelo menos três termos daquele tempo antes de dizer que não achou, e só complementar com conhecimento do modelo quando houver nome, data e lugar verificáveis. Depois disso a mesma pergunta passou a trazer um caso real de 1961, com citação.

A mesma lógica apareceu na busca dentro dos livros. "Lampião Angico" não existe como frase em lugar nenhum e dava zero páginas, embora as duas palavras apareçam juntas em dezenas delas. Agora, quando a frase não casa, a busca procura as palavras de conteúdo na mesma página e avisa que mudou de modo. E na busca de manchetes o termo é normalizado antes de ir pro ranking, pra que "Praça do Ferreira" e "PRAÇA DO FERREIRA" não virem duas buscas diferentes. É exatamente a busca de quem procura a própria rua.

Pro pesquisador, a decisão mais importante foi a IAcema não ser um RAG vetorial que devolve parágrafo bonito. Ela é um agente com ferramentas SQL, e a resposta cita a manchete, a edição e a data de onde saiu. Edição, fato, biografia e achado ganharam um bloco "Como citar", que só usa data exata quando ela bate com a folha digitalizada.

Teve também um caso de cadastro que mostra bem a diferença entre os públicos. As biografias vieram de duas obras, e uns duzentos cearenses aparecem nas duas. O reflexo de dev seria deduplicar. A regra do Prof. Gildácio Sá é que nada sai do cadastro: verbete de outra fonte é outro material. Então o encontro virou dado. As duas entradas se ligam a uma pessoa só, a página mostra o texto das duas obras, cada uma citada pelo nome. O curioso vê uma página limpa. O pesquisador não perde a fonte.

## Medir antes de redesenhar

Por muito tempo a gente não sabia o que as pessoas procuravam. A busca era uma das rotas mais acessadas do portal e não gravava uma linha sequer. Sem isso, não dá pra responder a pergunta que mais importa pra curadoria: o que buscam e não encontram.

Hoje cada busca grava o termo normalizado, sem IP cru (só um hash), com deduplicação pra que trocar de aba não infle o volume. O painel de buscas abre com a seção "procuraram e não encontraram". É a pauta de digitalização mais honesta que existe, porque vem de gente real batendo na parede do acervo.

Com a IAcema foi parecido. Só nascia registro quando alguém já tinha perguntado. Isso deixava duas situações iguais no dado e opostas no plano: se muita gente vê o chat e pouca pergunta, o problema é descoberta; se pouca gente vê e quase todo mundo pergunta, a entrada tá saudável e o problema é outro. Subi três eventos (o botão apareceu, a pessoa abriu, a pessoa perguntou) antes de mexer na interface, de propósito. Subindo junto com o redesign, eu nunca ia saber se a mudança funcionou.

A métrica de leitura também não é só pageview. O tracking que escrevi pro portal sabe qual conteúdo foi aberto, mede leitura só depois de um gesto real da pessoa, registra os PDFs (que saem direto do storage e antes eram invisíveis), compartilhamento, UTM das campanhas e os 404. Com isso apareceu que a grande maioria das visitas olha uma página só e nunca vê o menu. Ou seja, cada página de edição, de fato ou de achado é a porta de entrada inteira pra alguém, e precisa se sustentar sozinha.

Em cima disso tem duas peças que eu considero tão produto quanto a busca. O painel de curadoria das conversas, onde dá pra ler cada transcrição da IAcema e marcar o que ela acertou ou errou. Ferramenta de curadoria só vale se couber na rotina de quem cuida do acervo, e isso ainda é trabalho em andamento. E o relatório mensal pro stakeholder, que junta visitas, comparação com o mês anterior, conversas com citação e respostas degradadas. Quem mantém o acervo há décadas não precisa saber o que é FULLTEXT. Precisa saber se o portal está sendo usado e onde está fraco.

## Os mistérios de hoje

O que me fez gostar desse projeto foram as pessoas que chegam procurando alguém. Uma notícia sobre a morte de uma antepassada. Um avô que jogou futebol num clube da capital. Um tataravô com nome e cidade, e nada mais. Esses pedidos têm um padrão: nome de pessoa, às vezes só um sobrenome, e uma cidade pequena do interior. E muitas vezes a resposta existe, numa manchete que ninguém leu em setenta anos e que só ficou achável porque o OCR transformou a página em texto.

Foi isso que puxou decisões concretas. As páginas por cidade nasceram da naturalidade das biografias e juntam biografias, fatos e achados de cada município, porque quem procura família quase sempre começa pela cidade. A vitrine Achados do Acervo reúne descobertas com a imagem da página original, link pra edição e compartilhamento por WhatsApp, que é por onde essas histórias circulam em família.

E teve uma decisão de posicionamento que eu acho a mais importante de todas: não vender o portal como serviço de genealogia. O acervo tem manchete com nome de pessoa, não certidão. A frase que a gente usa é mais próxima de "seu sobrenome pode estar nos jornais antigos do Ceará". Do lado técnico, a mesma honestidade: MySQL não tem busca fonética útil pra português, Soundex é calibrado pro inglês, e Levenshtein sobre milhões de manchetes é caro demais. A saída viável é distância de edição contra uma lista de sobrenomes do acervo. Melhor prometer pouco e achar do que prometer "busca inteligente de nomes" e frustrar quem está procurando a bisavó.

Sobre a IAcema, a coisa que mais me orgulha não é quando ela acha. É quando diz que não achou e explica por quê: o ano está fora da cobertura dos jornais, ou o jornal da época simplesmente não registrava gente comum. Pro curioso isso é só uma resposta. Pro pesquisador, é o que faz ele confiar no resto.
