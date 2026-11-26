---
title: "A parte invisível de um SaaS que cresceu"
slug: "a-parte-invisivel-de-um-saas"
description: "Um gráfico que apagava o passado, um app que voltava pra versão velha e um webhook que rebaixava quem pagava. O que aprendi como CTO do Leap Notes."
category: "Engenharia"
tags: ["engenharia", "saas", "supabase", "postgres", "cto"]
order: 8
---

Um dia meus sócios me mandaram um print do painel de admin do [Leap Notes](https://leapnotes.app) com uma pergunta simples: "uma semana atrás esse dia tinha mais gente ativa. Por que agora tem menos?". O gráfico de usuários ativos por dia estava encolhendo o passado. Cada vez que alguém abria o painel, os dias antigos tinham um pouco menos de gente.

Ninguém de fora vê esse tipo de coisa. O usuário vê o editor de notas, a anatomia 3D, o Leap AI. Mas quando um produto sai do MVP de bloco de notas e passa a ter cobrança, plano grátis, plano pago, app no celular e dezenas de edge functions, a maior parte do meu trabalho como CTO virou a parte que não aparece em print de rede social. Separei quatro histórias dessa parte, porque cada uma me ensinou uma regra que hoje eu sigo sem pensar.

## O gráfico que apagava o passado

A primeira reação foi achar que era bug de fuso ou de `updated_at`, que é o suspeito de sempre. Não era. A consulta contava os usuários ativos de cada dia olhando pra quem tinha criado nota ou salvo uma versão de rascunho naquele dia. O `created_at` de cada linha é imutável, então em tese o passado não mudava.

O problema é que as linhas somem. Um cron semanal poda versões antigas de rascunho de usuários do plano grátis. Usuários apagam notas. Apagar uma pasta apaga em cascata o que tem dentro. E um `COUNT(DISTINCT user_id)` recalcula sobre o que existe hoje. Linha apagada, usuário sumido daquele dia.

A correção foi parar de derivar métrica histórica de tabela operacional. Criei uma tabela só pra isso, `daily_active_users`, com chave primária em (dia, usuário), que só recebe inserção e nunca é podada. Um cron diário tira a foto do dia, e fiz um backfill único com o que ainda existia. Duas decisões ali foram de propósito:

- A tabela tem RLS ligada e nenhuma policy. Ninguém lê nem escreve direto, só funções no servidor.
- Ela não tem chave estrangeira pra tabela de usuários. Se alguém apaga a conta, o histórico agregado não pode ir junto em cascata. Quando a LGPD pedir a remoção, vira um passo explícito, não um efeito colateral.

O dado que já tinha sido podado não voltou, e eu disse isso aos sócios com todas as letras. Prefiro um gráfico com um buraco honesto a um gráfico bonito que mente. A regra que ficou: **se um número vai ser comparado com o passado, ele precisa de um registro que só cresce**.

## Fail-closed e a ordem do deploy

Quando o Leap AI ganhou limite de uso por plano, a reserva de cota passou a ser uma função no banco que, numa transação, confere o plano, verifica o quanto a pessoa já usou no dia e reserva a unidade. Atômico, pra duas abas abertas não furarem o limite ao mesmo tempo.

Escolhi que ela fosse fail-closed. Se a checagem de cota falha por qualquer motivo, o assistente responde erro em vez de liberar. Num produto com chamada de LLM paga por token, falhar aberto é deixar a torneira ligada enquanto você dorme.

Só que fail-closed tem um custo que a gente esquece: ele transforma a ordem do deploy em requisito. Se o código da edge function sobe antes da migration que cria a função de cota, a chamada não encontra a função, cai no `catch` e o assistente fica fora do ar pra todo mundo. Não pra quem estourou o limite. Pra todo mundo.

Por isso a ordem virou lei no projeto: migration primeiro, function depois, front por último. A migration é aditiva e idempotente (`create if not exists`, `create or replace`), então rodar duas vezes não estraga nada. O front degrada com calma se o backend ainda não chegou. E quando o produto amadureceu, isso entrou no processo: migration vai em PR própria, antes do front, e merge na branch principal publica backend, então ninguém mergeia sem saber o que vai pra produção.

Teve um detalhe que só apareceu na revisão. No Postgres do Supabase, `revoke execute ... from public` não basta pra fechar uma função. Os papéis de usuário anônimo e autenticado recebem permissão de execução por padrão em toda função nova. Sem revogar deles explicitamente, qualquer pessoa logada poderia chamar a função de cota direto, passando o limite que quisesse. O freemium inteiro dependia de uma linha de `revoke` a mais.

## O app que voltava pra versão antiga

Essa me custou uma tarde e três bugs encadeados. O sintoma: você abria o app e via a versão nova depois de um recarregamento forçado, fechava, abria de novo e estava na antiga. Parecia assombração.

O primeiro bug era de cabeçalho. O servidor entregava o `sw.js`, o service worker, com um content-type diferente do que a regra de cache esperava, então ele caía na regra genérica e ficava cacheado por sete dias. O service worker velho seguia servindo o bundle velho que tinha guardado.

O segundo era pior: a correção do cabeçalho nunca chegava ao servidor. O script de deploy pulava todo arquivo começado com ponto, pra não subir coisa sensível por acidente. Fazia sentido, só que o `.htaccess` também começa com ponto. O arquivo de configuração do servidor estava congelado numa versão antiga.

O terceiro era o verificador de versão do próprio app, que se enganava sozinho. Ele comparava a versão do servidor com uma referência que ele mesmo gravava a partir do servidor. No primeiro descompasso recarregava a página, gravava a referência nova, o service worker servia o bundle antigo de novo e o app ficava preso achando que estava atualizado. A limpeza de cache ainda preservava justamente o cache do service worker.

A correção foi assar a data do build dentro do próprio bundle na hora de compilar e comparar o que o app *é* com o que o servidor *diz que existe*, sem referência intermediária. Desde então todo deploy visível também atualiza o número da versão e as notas da versão, aquele modal que abre no rodapé. Parece burocracia até o dia em que você precisa saber, olhando o celular de alguém, qual código está rodando ali.

## O webhook que rebaixava quem pagava

O Leap Notes tem checkout próprio e três gateways de pagamento: cartão, Pix e assinatura. Cada um manda seus eventos por webhook, e cada evento mexe no plano de alguém. Quanto mais gateway, mais caminho pra um evento chegar na ordem errada ou falar de uma assinatura que já não é a atual.

Um caso de suporte mostrou isso. Uma pessoa acabou com duas assinaturas ativas no mesmo cartão. Cancelamos a duplicada, como manda o bom senso, e o gateway disparou o evento de assinatura apagada. O handler fez o que tinha sido escrito pra fazer: rebaixou a conta pro plano grátis. Ela estava pagando a outra assinatura e perdeu o acesso.

O handler confiava no evento sem perguntar de qual assinatura ele falava. O conserto foi um guard: só rebaixar se o id da assinatura apagada for o mesmo id que está registrado como a assinatura atual daquele usuário, e nunca mexer em quem tem plano vitalício. Depois disso fiz uma varredura no banco inteiro procurando qualquer outra conta com plano e assinatura divergentes. Não tinha nenhuma, mas eu só dormi tranquilo depois de olhar.

O débito que ficou anotado é guardar todo evento de pagamento numa tabela própria, com histórico, em vez de só aplicar o efeito. Sem isso, investigar um caso desses depende de abrir o painel do gateway e reconstruir a linha do tempo na mão.

## O que ninguém pede e todo mundo usa

Nenhuma dessas histórias virou funcionalidade que eu possa mostrar num vídeo. Ao lado delas tem outras do mesmo tipo: o catálogo de conteúdo pago que ia inteiro dentro de um chunk JavaScript público e foi tirado do bundle pra ser servido pelo backend com checagem de plano, porque esconder no front não é paywall. Crons que expiram planos vencidos e avisam quando alguém pagou e não teve o acesso ativado. Um gate local que roda só os testes do escopo que a PR tocou. Backup do banco três vezes ao dia, e a descoberta de que uma migration mergeada durante o backup falha por lock e não chega à produção, então o script de merge agora espera o backup terminar. PostHog nos funis de checkout e onboarding, Sentry nos erros que importam.

Time enxuto, como o nosso, não tem um time de plataforma pra cuidar disso. Ou o CTO cuida, ou ninguém cuida, e o produto continua bonito por fora até o dia em que o gráfico mente, o app volta no tempo ou alguém que paga perde o acesso. Boa parte da minha semana é ler cron, webhook e log de deploy pra esse dia não chegar.
