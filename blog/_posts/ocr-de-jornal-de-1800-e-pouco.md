---
title: "O que sobra depois do OCR em papel de 1800 e pouco"
slug: "ocr-de-jornal-de-1800-e-pouco"
description: "Como um acervo de mais de 30 anos, guardado como imagem e TXT sujo, virou busca full-text sobre 2,5 milhões de manchetes no Portal da História do Ceará."
category: "Engenharia"
tags: ["ocr", "mysql", "dados", "full-text", "phc"]
order: 4
---

Quando eu entrei no Portal da História do Ceará, o acervo já tinha mais de 30 anos de trabalho em cima. Jornais fotografados página por página, revistas escaneadas, fichas de catálogo montadas à mão pelo Prof. Gildácio Sá. O que não existia era o jeito de alguém achar alguma coisa ali dentro. Era dado bruto: pasta, imagem, planilha, TXT. A pergunta que eu precisava responder era simples de falar e chata de resolver: como uma pessoa digita "farmácia" e chega na página certa de uma revista de 1890?

Hoje o portal tem busca full-text sobre 2,5 milhões de manchetes, de 250 mil edições de 133 jornais catalogados. O caminho até lá foi muito menos glamoroso do que o número sugere. Quase tudo foi limpeza, casamento de nomes e decisão sobre o que *não* gravar.

## O que sai do OCR

A primeira coisa que aprendi é que OCR não entrega texto. Entrega um palpite sobre o texto, e o palpite piora conforme o papel envelhece. Página de revista do fim do século XIX tem tinta que vazou do verso, coluna torta, mancha de umidade, tipografia que o modelo nunca viu. O TXT que sai disso vem com palavra partida no fim da linha ("consti-" numa linha, "tuição" na outra), cabeçalho de página repetido no meio do parágrafo, número de página grudado em palavra, letra trocada por símbolo.

E tem o lixo que vem do próprio arquivo, antes de qualquer OCR. Os TXTs chegavam em encodings diferentes: uns em UTF-8 com BOM no começo, outros em Windows-1252, porque foram gerados em máquinas e anos diferentes. A tabela `artigo` do banco era latin1, herança do sistema antigo. O script de carga ficou com essa cara:

```php
$txt = file_get_contents($f);
$txt = preg_replace("/^\xEF\xBB\xBF/", "", $txt); // tira o BOM
if (!mb_check_encoding($txt, "UTF-8")) {
    $txt = mb_convert_encoding($txt, "UTF-8", "Windows-1252");
}
```

A coluna nova do texto (`texto_artigo`) nasceu em utf8mb4, mesmo com a tabela em latin1. Migrar a tabela inteira seria um projeto à parte. Criar só a coluna resolvia o problema que importava.

Testei dois caminhos de extração. O primeiro é o clássico: o OCR lê caractere por caractere, gera o TXT, e eu limpo depois. O segundo foi mandar o PDF direto pra um modelo multimodal (usei o Gemini 2.5 Flash) e pedir, página a página, um JSON com o texto, um resumo curto e uma nota de confiança. O multimodal entende layout muito melhor: sabe que aquilo é rodapé, junta a palavra hifenizada, ignora a mancha. Em troca, ele às vezes "melhora" o texto por conta própria. Por isso o primeiro módulo que montei com ele não gravava nada no banco. Mostrava o JSON na tela, alguém conferia, e só depois entrava.

Essa desconfiança vale até hoje. O campo de manchetes dos jornais mistura transcrição de OCR com resumo feito por máquina. É ótimo pra busca e péssimo pra citação literal. Regra da casa: nunca cite uma frase dali sem abrir a imagem da página.

## Pharmacia, anno, thesoureiro

O problema que mais me pegou de surpresa não foi técnico. Foi de ortografia.

Texto anterior à reforma de 1943 escreve "pharmacia", "anno", "thesoureiro", "immigração", "commissão". O OCR, quando acerta, acerta *isso*. Só que o pesquisador digita "farmácia". E o índice full-text do MySQL compara palavra com palavra. A collation `utf8mb4_unicode_ci` ainda me salva do acento ("farmacia" casa com "farmácia"), mas não transforma "ph" em "f".

A primeira versão do prompt mandava preservar a grafia original, porque parecia o certo do ponto de vista histórico. Mudei de ideia quando percebi que a busca ficaria cega pra quase tudo antes de 1943. A decisão final: o campo de texto que vai pro índice sai **normalizado** pro português atual (tira h e y mudos, troca ph por f, simplifica consoante dobrada, põe acento), e o PDF original continua lá pra quem quer ver a grafia de época. O índice serve quem procura. A fonte serve quem estuda.

Pra o hífen de quebra de linha a regra é sem exceção: sempre une. Uma palavra partida em duas é uma palavra que nunca vai ser encontrada.

## Quando o arquivo não tem o nome que o banco diz

Metade do trabalho de dados nesse projeto foi descobrir que o catálogo e os arquivos não concordavam entre si.

O caso mais didático foi a Revista do Instituto do Ceará, que tem números desde 1887. O professor reclamou que não conseguia abrir os PDFs dos artigos dela, só os de outra revista. Cruzei o banco com a listagem real do bucket onde os PDFs moram e o retrato dos 3.723 artigos foi este:

- 49 casavam pelo nome exato (os de 1887 a 1889, que não têm prefixo no arquivo);
- 3.347 casavam se eu colocasse o prefixo `RIC_` que o catálogo tinha perdido na carga;
- 208 casavam com o prefixo, mas moravam na pasta de um tomo especial, não na do ano;
- 119 simplesmente não casavam.

Os três primeiros grupos viraram uma migration de dados, com guarda pra não aplicar duas vezes. Os 119 restantes eram erro humano de digitação, do tipo `FundmanetosGeograficos` no banco contra `FundamentosGeograficos` no arquivo. Pra esses escrevi um reconciliador por similaridade de nome, dentro da mesma pasta, com três limiares: acima de 85% de semelhança é candidato; só aplica se o segundo colocado estiver pelo menos 3 pontos atrás (tem artigo tipo "Notas e Transcrições" que se repete várias vezes no mesmo ano); abaixo de 70% nem sugere. Tudo o que ficou ambíguo foi pra um CSV de curadoria. Quem decide é quem conhece o acervo, não o script.

Com a outra revista, a da Academia Cearense de Letras, a surpresa foi boa. Boa parte dos PDFs já tinha texto embutido, de OCR feito no próprio escaneamento ou de arquivo que já nasceu digital. Numa amostra de 40, 34 devolveram texto com `pdftotext`. Rodei em todos e 2.458 dos 2.835 artigos ganharam texto pesquisável sem passar por OCR nenhum. Na Revista do Instituto foram 2 de 20: escaneamento que é imagem pura, e continua dependendo dos TXTs do OCR do professor.

O detalhe que mais gosto desse script é um limite de 200 caracteres. Abaixo disso o PDF é imagem e o `pdftotext` devolve quebra de linha e meio cabeçalho. Gravar isso seria pior do que não gravar nada, porque o artigo passa a aparecer na busca por causa de ruído. Então ele mede, relata e pula.

## Uma busca que aguenta o tranco

Com o texto limpo no lugar, a busca é um `FULLTEXT` do MySQL sobre a tabela de manchetes, e outro sobre o texto dos artigos. Sem Elasticsearch, sem serviço extra. Pra o tamanho do acervo e do servidor, é o suficiente, e é uma peça a menos pra cair.

Um ajuste pequeno fez muita diferença: quando a pessoa digita mais de uma palavra, a busca trata como frase exata em modo booleano. Quem procura "Padre Cícero" quer os dois nomes juntos, não toda manchete que tenha um padre ou um Cícero. Palavra solta continua no modo natural, ordenado por relevância.

Outra lição veio da tabela de manuscritos, que tem meta de centenas de milhares de documentos. O índice full-text nasce junto com a tabela, vazia. Criar depois, com a tabela cheia, segura lock longo em produção, e o portal fica fora enquanto o índice é montado.

E aí chegou a parte que nenhum tutorial de full-text conta. Uma busca é a página mais cara do site, e cada manchete nas páginas de edição era um link pra busca daquela manchete. Um raspador distribuído, vindo de milhares de IPs e ignorando o `robots.txt`, começou a seguir esses links com um termo diferente a cada pedido. Cache não ajuda quando nenhum termo se repete. Os poucos workers do PHP lotaram e o portal inteiro passou a responder 504, não só a busca.

A correção foi tratar a busca como recurso escasso: no máximo duas buscas no banco ao mesmo tempo, controladas por `flock`. Sem vaga, a resposta é um 503 com `Retry-After` na hora, e o worker volta pra servir o resto do site. Busca que já está em cache não precisa de vaga. De quebra, a lista de anos disponíveis, que custava quase um segundo por carga, passou a ficar uma hora em arquivo. Depois do deploy os 504 zeraram, e quem leva o 503 é quase sempre o robô.

Olhando pra trás, o OCR foi a parte menor do trabalho. O grosso foi decidir o que conta como texto, de qual nome confiar, que grafia indexar e quanto da máquina o banco aguenta dar pra cada visitante. Se quiser ver o resultado, está em [historiadoceara.com.br](https://historiadoceara.com.br). Procura o nome da sua rua.
