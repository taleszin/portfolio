---
title: "Velocidade com freio, ou como eu entrego rápido com agentes de código"
slug: "velocidade-com-freio"
description: "Não tem mais motivo pra demorar meses entre a ideia e o produto no ar. Mas um dia 8 agentes em paralelo travaram meu Mac, e isso me ensinou o resto."
category: "IA"
tags: ["agentes de código", "claude code", "produtividade", "code review", "engenharia de software"]
order: 10
---

Numa segunda-feira de novembro eu tinha 18 pull requests abertas e uma ideia que parecia ótima: soltar 8 agentes de código em paralelo, cada um pegando uma PR, e ir dormir com tudo resolvido. Quatro horas depois eram 9 merges, o disco do Mac em 99% e um vigia de processos que tinha congelado os testes por uma hora e meia. Cada agente rodava a instalação de dependências e a suíte inteira, uns 12 mil testes, ao mesmo tempo, num notebook de 16 GB. A carga do sistema foi parar perto de 290.

Começo por esse dia porque eu tenho uma opinião forte sobre velocidade e não quero que ela soe como propaganda.

## Não tem mais desculpa pra tanta demora

Quando comecei a estagiar, tive menos de um mês pra aprender PHP, sem IA, na base da documentação e de errar muito. Hoje sou CTO de uma startup, tech lead de um portal histórico e engenheiro em outro produto, sempre em time enxuto. Isso só cabe na semana porque a distância entre "tive uma ideia" e "tá no ar" encolheu muito.

Eu uso o [Claude Code](https://claude.com/claude-code) praticamente o dia inteiro, e pedir função pronta é o de menos. O uso principal é orquestrar: um agente levanta o código envolvido, outro critica o plano, outro implementa, outro testa no navegador. O que antes era uma semana de vai e volta vira uma tarde. Por isso acho que hoje não tem motivo pra um produto demorar meses entre a concepção e a entrega, e quem decide que "isso é modinha" para de acompanhar justamente quando a coisa fica boa.

Fora da bolha, quase ninguém imagina o que dá pra fazer com isso dentro de uma empresa. Pra maioria, IA é o resumo que aparece no topo da busca do Google. Eu penso em processo interno: a planilha atualizada na mão toda sexta, o relatório que ninguém tem tempo de montar, a pergunta de negócio sem resposta porque o dado tá em três lugares. No Portal da História do Ceará, montei uma IA que consulta o banco do acervo e cita a fonte, rodando num modelo barato. Foi nesse tipo de coisa que a velocidade fez mais diferença pra mim.

## Rápido não é sem freio

Agente de código erra com a mesma confiança com que acerta. Já vi agente relatar que uma mudança não tinha chegado em produção quando tinha. Já vi auditoria contar quase nenhum teste num repositório que tinha milhares, porque olhou a branch errada. Se você só aperta o acelerador, entrega o bug rápido também.

Então meu fluxo tem freio nas pontas. Antes de implementar, vários agentes auditam: um mapeia o código, outro procura onde a premissa pode estar errada, outro pergunta se aquele é o menor recorte que entrega valor. Antes da PR, uma revisão adversarial que tenta derrubar cada premissa apontando arquivo e linha; se o agente diz "isso já é tratado em outro lugar", ele tem que mostrar onde. Antes do merge, CI verde, bot e auditoria minha são necessários, mas quem aprova é uma pessoa do time. Depois do merge, o que foi pra produção se confere em produção, não no relato do agente.

![Diagrama com as cinco etapas do fluxo: auditoria, implementação, revisão adversarial, teste com review humano e conferência do estado real](img/blog/velocidade-com-freio/freios.webp "O agente acelera o meio. As pontas ficam com verificação que não depende do relato dele.")

Parece burocracia, mas quase sempre sai mais rápido. Uma PR que volta do review porque a premissa nunca foi conferida custa mais do que a auditoria que teria pego o problema antes.

## O que os 8 agentes me ensinaram

O erro daquela segunda foi tratar paralelismo como se fosse de graça. Raciocínio paraleliza bem. Build e suíte de testes não: oito processos pesados disputando a mesma memória rodam mais devagar que três em fila. E uma PR já mergeada tinha quebrado os testes de todo mundo, coisa que eu só descobri no meio da bagunça.

No dia seguinte refiz a rodada com outra receita, e ela fechou 13 PRs mergeadas e o deploy em umas três horas, com só 3 agentes:

1. **Linha de base primeiro.** Rodar o gate completo na branch principal limpa antes de despachar qualquer agente. Se ela já tá quebrada, ninguém vai ficar verde.
2. **No máximo três agentes pesados, separados por tema.** A PR grande sozinha num agente, as mudanças de banco em outro, o resto num terceiro.
3. **Agente não mergeia.** Eles leem, revisam e corrigem. Os merges ficam comigo, em série, com um script que para na primeira falha.
4. **PRs relacionadas numa branch de integração.** Resolve conflito uma vez, roda o gate uma vez no estado final.
5. **Navegador antes de produção.** Deploy no ambiente de dev e um agente usando o app de verdade com conta de teste, que me entrega um laudo.

![Comparação entre oito agentes soltos, com 9 merges em 4 horas, e três agentes por tema, com 13 PRs e deploy em cerca de 3 horas](img/blog/velocidade-com-freio/oito-contra-tres.webp "Mesma fila, mesmo notebook, dois dias seguidos.")

Eu achava que velocidade era quantidade de coisa rodando ao mesmo tempo. Na prática é quanto trabalho chega em produção sem voltar.

Teve um ajuste depois, com o sinal trocado. Num reteste de uma feature colaborativa, deixei tudo em série num agente só, e cada rodada que achava defeito custava uns 20 minutos até a próxima. Teste em navegador headless pesa pouco, então dava pra dividir por frente independente (perda de texto, reconexão de rede, quem enxerga o quê), cada uma com as próprias contas descartáveis. O freio vai no que é pesado e arriscado. O resto pode correr em paralelo.

## Por que eu continuo acelerando

Tem gente que olha uma história dessas e conclui que agente de código não presta. Eu concluo o contrário: a ferramenta é boa o bastante pra eu ter travado um Mac de tanto trabalho que mandei pra ela. Faltava método. Ainda erro a dose de vez em quando, e quando erro, a regra nova vai pro meu fluxo pra não repetir.
