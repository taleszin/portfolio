---
title: "Velocidade com freio, ou como eu entrego rápido com agentes de código"
slug: "velocidade-com-freio"
description: "Não tem mais motivo pra demorar meses entre a ideia e o produto no ar. Mas um dia 8 agentes em paralelo travaram meu Mac, e isso me ensinou o resto."
category: "IA"
tags: ["agentes de código", "claude code", "produtividade", "code review", "engenharia de software"]
order: 10
---

Numa segunda-feira de novembro eu tinha 18 pull requests abertas no Leap Notes e uma ideia que parecia ótima: soltar 8 agentes de código em paralelo, cada um pegando uma PR, e ir dormir com tudo resolvido. Quatro horas depois, eram 9 merges, o disco do Mac em 99% e um vigia de processos que tinha congelado os testes por uma hora e meia. Cada agente rodava `npm ci` e a suíte inteira (uns 12 mil testes) ao mesmo tempo, num notebook de 16 GB. A carga do sistema foi parar perto de 290.

Começo por esse dia porque eu tenho uma opinião forte sobre velocidade e não quero que ela soe como propaganda.

## Não tem mais desculpa pra tanta demora

Quando eu comecei a estagiar, tive menos de um mês pra aprender PHP. Sem IA, na base da documentação e de errar muito. Hoje eu sou CTO de uma startup, tech lead de um portal histórico e engenheiro em outro produto, tudo ao mesmo tempo, sempre em time enxuto. Isso só cabe na semana porque a distância entre "tive uma ideia" e "tá no ar" encolheu muito.

Eu uso o [Claude Code](https://claude.com/claude-code) praticamente o dia inteiro. Pedir função pronta é o de menos. O uso principal é orquestrar trabalho: um agente levanta o código envolvido, outro critica o plano, outro implementa, outro testa no navegador. O que antes era uma semana de vai e volta vira uma tarde.

Por isso eu acho que, hoje, não tem mais motivo pra um produto demorar meses entre a concepção e a entrega como demorava pouco tempo atrás. E o dev que se recusa a aprender isso fica pra trás muito rápido. Não digo isso como ameaça. É só que as ferramentas mudam a cada poucos meses, e quem decide que "isso é modinha" para de acompanhar justamente quando a coisa fica boa.

## A bolha é menor do que parece

Ao mesmo tempo, eu sei que vivo numa bolha. Se você perguntar pra alguém fora da área o que é IA, o máximo que a pessoa conhece é o resumo do Gemini que aparece no topo da busca do Google. E muita gente acha até isso um absurdo.

Fora da bolha quase ninguém imagina o que dá pra fazer com isso dentro de uma empresa. Não falo de chatbot no site. Falo de processo interno: a planilha que alguém atualiza na mão toda sexta, o relatório que ninguém tem tempo de montar, a pergunta de negócio que fica sem resposta porque o dado tá espalhado em três lugares. No Portal da História do Ceará eu montei uma IA que consulta o próprio banco do acervo com SQL e usa RAG pra citar a fonte, rodando num modelo barato da OpenAI. No Leap Notes, o painel administrativo virou o lugar onde meus sócios tomam decisão olhando dado real, não achismo.

Esse é o potencial que eu acho que o mercado de trabalho ainda não entendeu: agilizar operação e colocar inteligência de negócio onde hoje tem gente copiando e colando. Pra mim, pelo menos, foi aí que a velocidade fez mais diferença.

## Rápido não é sem freio

Agora o contraponto, que é a parte que pouca gente conta. Agente de código erra com a mesma confiança com que acerta. Eu já vi um agente aplicar uma migration em produção e relatar que não tinha aplicado. Já vi auditoria contar quase nenhuma linha de teste num repositório que tinha milhares, porque ela só olhou a branch principal. Se você só aperta o acelerador, entrega rápido o bug também.

Então meu fluxo tem freio em cada etapa:

- **Antes de implementar**, uma auditoria com vários agentes: um mapeia o código, outro procura onde a premissa pode estar errada, outro pergunta se aquilo é o menor recorte que entrega valor. Só depois alguém abre o editor.
- **Antes da PR**, uma revisão adversarial. A ideia é derrubar cada premissa apontando arquivo e linha. Se o agente diz "isso já é tratado em outro lugar", ele tem que mostrar onde.
- **Antes do merge**, teste de verdade e review humano. CI verde, aprovação de bot e auditoria minha são necessárias, mas não bastam. Quem aprova é uma pessoa do time.
- **Depois do merge**, conferir o estado real. Migration aplicada se confere no banco, não no relato do agente.

Parece burocracia, mas quase sempre isso sai mais rápido que o caminho sem freio. Uma PR que volta do review porque a premissa nunca foi conferida no código custa mais tempo do que a auditoria que teria pego o problema antes.

## O que os 8 agentes me ensinaram

Voltando àquela segunda. O erro não foi usar agentes, foi tratar paralelismo como se fosse de graça. O raciocínio paraleliza bem. O build e a suíte de testes não: oito processos pesados disputando a mesma memória rodam mais devagar do que três em fila. E tinha um detalhe pior: uma PR já mergeada tinha quebrado os testes de todo mundo, e eu só descobri no meio da bagunça. Fiquei horas acompanhando agentes que esperavam uma máquina sufocada.

No dia seguinte eu refiz a rodada com outra receita, e ela fechou 13 PRs mergeadas e o deploy em umas três horas, com só 3 agentes:

1. **Linha de base primeiro.** Antes de despachar qualquer agente, rodar o gate completo na branch principal limpa. Se ela já tá quebrada, ninguém vai ficar verde.
2. **No máximo três agentes pesados, separados por tema.** A PR grande sozinha num agente. A pilha de mudanças de banco em outro, com prova da ordem das migrations num Postgres descartável. O resto num terceiro.
3. **Agente não mergeia.** Eles leem, revisam e corrigem. A verificação pesada e os merges ficam comigo, em série, com um script que para na primeira falha e confere a migration em produção entre um merge e outro.
4. **PRs relacionadas numa branch de integração.** Junta tudo, resolve conflito uma vez, roda o gate uma vez no estado final e mergeia de uma vez.
5. **Validação no navegador antes de produção.** Deploy no ambiente de dev e um agente usando o app de verdade com conta de teste, que no fim me entrega um laudo.

Essa experiência mudou o jeito que eu penso velocidade. Eu achava que era quantidade de coisa rodando ao mesmo tempo, e na prática é quanto trabalho chega em produção sem voltar. Três agentes bem orquestrados entregaram mais do que oito soltos.

Teve um ajuste depois, com o sinal trocado. Num reteste de uma feature de coedição, eu deixei tudo em série num agente só, e cada rodada que achava defeito custava uns 20 minutos até a próxima. Teste em navegador headless pesa pouco, então dava pra dividir por frente independente (perda de texto, reconexão de rede, quem enxerga o quê), cada uma com as próprias contas descartáveis. O freio vai no que é pesado e arriscado, e o resto pode correr em paralelo.

## Por que eu continuo acelerando

Tem gente que olha uma história dessas e conclui que agente de código não presta. Eu concluo o contrário: a ferramenta é boa o bastante pra eu ter conseguido travar um Mac de tanto trabalho que mandei pra ela. O que faltava era método.

Desconfiar da IA é saudável. Quem fica pra trás é quem não aprende a usar, ou quem usa sem conferir. Eu tento ficar no meio: aprender rápido o que aparece de novo, botar no fluxo, e manter os freios que já me salvaram mais de uma vez. Ainda erro a dose de vez em quando, e quando erro a regra nova vai parar no meu fluxo pra não repetir.
