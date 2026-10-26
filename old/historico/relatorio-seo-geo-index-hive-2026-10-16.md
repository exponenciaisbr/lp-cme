# Relatório de SEO e GEO — index-hive

**Data:** 16 de outubro de 2026. **Arquivo entregue:** `public/index-hive.html`.

A página foi duplicada de `public/index-cme.html`. A versão nova preserva os textos visíveis, as 12 seções, os 33 títulos, as imagens, os links, o CSS e o JavaScript de interação. O arquivo original permanece intacto. A marca continua sendo CMe; `index-hive` identifica apenas esta versão técnica.

**Prévia local:** [abrir index-hive](http://127.0.0.1:8788/index-hive). Os arquivos estão no ambiente local; a versão nova ainda não foi enviada ao GitHub nem publicada no Cloudflare. Quando houver um push na `main`, o workflow existente publicará o arquivo junto com os demais assets.

**Alterações realizadas**

| Área | Antes | Implementação na cópia | Finalidade |
|---|---|---|---|
| Título e descrição | Título com o nome institucional e descrição de 190 caracteres | Título `CMe \| Centro para Mudanças Exponenciais no Brasil` (49 caracteres) e descrição de 150 caracteres | Comunicar identidade, atuação e contexto brasileiro com concisão nos resultados de busca |
| Identidade editorial | Sem metatag de autoria | `author` identifica o Centro para Mudanças Exponenciais | Atribuir o conteúdo à organização responsável |
| Canonical | Ausente | URL absoluta para `https://lp-cme.governanca-c8e.workers.dev/index-cme` | Sinalizar a versão principal do conteúdo duplicado |
| Prévia nos buscadores | Sem controle explícito de snippets | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` | Permitir rastreamento, links e prévias sem limites adicionais definidos pela página |
| Open Graph e Twitter Cards | URLs para o domínio previsto e imagem `/og-image.jpg` inexistente | Título e descrição sincronizados, `og:url` alinhado à canonical, cartão `summary`; referências à imagem ausente removidas | Evitar metadados inconsistentes e a indicação de um arquivo inexistente |
| Dados estruturados | Sem JSON-LD | Grafo Schema.org com organização, site, página, conceito, livros e equipe | Explicitar entidades e relações presentes no texto para sistemas que consomem dados estruturados |
| Fontes do primeiro quadro | Descobertas pelo CSS | Preload dos arquivos WOFF2 dos pesos 600 e 300, usados no título e na chamada | Antecipar a descoberta das fontes críticas, mantendo `font-display: swap` |
| Imagens | Sem estratégia explícita de carregamento | 48 imagens com `loading="lazy"`, logotipo do cabeçalho com `loading="eager"` e as 49 imagens com `decoding="async"` | Adiar downloads abaixo do primeiro quadro e permitir decodificação assíncrona |
| Retratos | Seis imagens com `alt` vazio | Descrições com nome e função das quatro pessoas da equipe e das duas pessoas dos depoimentos | Tornar a informação visual identificável por leitores de tela e sistemas de busca de imagens |
| Downloads | Três links com o mesmo nome acessível | `aria-label` com o título de cada livro, `type="application/pdf"` e `hreflang="pt-BR"` | Identificar destino, formato e idioma sem trocar o texto visível do botão |
| Semântica dos blocos | `main` e dois cards sem ligação explícita com seus títulos | Três atributos `aria-labelledby` e dois IDs de títulos adicionados | Associar os blocos aos respectivos títulos sem alterar sua apresentação |

A descrição nova é: “O CMe é o hub brasileiro do C4EC, incubado pelo Instituto Beja. Apoia mudanças sistêmicas com Pensamento Societal e Jornadas para Mudança Exponencial.” Contagem de caracteres serve como referência editorial; a exibição nos resultados depende do buscador e da consulta.

**Dados estruturados e GEO**

O JSON-LD contém nove entidades principais conectadas por identificadores `@id`: uma `Organization`, um `WebSite`, uma `WebPage`, um `DefinedTerm`, uma `ItemList` e quatro `Person`. Dentro desse grafo também estão as 12 partes da página, os três livros e seus PDFs, idioma e capas. Nome institucional, sigla, contato, LinkedIn, abrangência no Brasil e funções da equipe são derivados do conteúdo existente.

A estrutura identifica o CMe e relaciona a organização ao conteúdo descrito. Não atribui autoria dos livros aos curadores nem inventa CNPJ, endereço, telefone, avaliações, datas de publicação ou resultados de impacto. Os tipos descrevem o conteúdo; cada um não corresponde necessariamente a um recurso visual especial do Google. Essa abordagem segue a orientação de [manter os dados estruturados compatíveis com o conteúdo visível](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) e de [identificar a organização com informações pertinentes e verificáveis](https://developers.google.com/search/docs/appearance/structured-data/organization).

O conteúdo principal já está no HTML entregue pelo servidor, com hierarquia de títulos e âncoras, sem depender do player ou do menu para ser lido. Isso foi preservado. Não foram criadas FAQs ocultas, repetições de palavras-chave ou arquivos que prometem acesso especial a respostas de IA. O [Google informa que suas experiências com IA usam os fundamentos de SEO e não exigem arquivo ou schema específico para IA](https://developers.google.com/search/docs/appearance/ai-features). Dados estruturados podem ajudar a interpretar o conteúdo; não garantem indexação, posição ou citação por um sistema generativo.

**Decisão sobre duplicidade e domínio**

Como `index-hive` repete o conteúdo de `index-cme`, a cópia aponta para a URL original como canonical. Essa indicação ajuda a consolidar os sinais entre versões equivalentes, conforme a [documentação do Google sobre canonicalização](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Ela é uma preferência, e o buscador pode selecionar outra URL.

Consequência prática: `index-hive` pode ser tratada como uma alternativa e não aparecer como resultado independente. Para colocar esta implementação em produção como versão principal, deve-se substituir o HTML da URL principal ou definir a promoção de `index-hive`, alinhando canonical, `og:url`, JSON-LD, links e eventual redirecionamento. Enquanto a original for a principal, não há garantia de que os ajustes existentes somente nesta cópia sejam aproveitados para ela.

Nesta sessão, a tentativa de resolver `exponenciais.org.br` falhou. Por isso, os novos endereços absolutos usam o Worker que já havia sido publicado e verificado. Isso não representa uma decisão definitiva de domínio. Ao conectar o domínio institucional, os endereços absolutos devem ser atualizados em conjunto; há um comentário de manutenção no HTML.

**Verificação realizada**

| Verificação | Resultado |
|---|---|
| Integridade da original | `git diff` sem alterações em `public/index-cme.html`; conteúdo comparado com o commit atual |
| Conteúdo e apresentação no código | Texto do `body`, sequência de elementos, títulos, links, endereços das imagens, CSS e JavaScript de interação idênticos |
| Comparação no navegador em desktop | 147 elementos comparados em viewport de 1440 × 709: geometria, fontes, cores e fundos idênticos |
| Comparação no navegador em celular | Os mesmos 147 elementos em viewport de 390 × 844: nenhuma diferença nos atributos de apresentação medidos |
| JSON-LD | JSON válido; [Schema Markup Validator](https://validator.schema.org/) retornou **0 erros e 0 avisos** no grafo conectado |
| IDs, relações ARIA e imagens locais | IDs únicos, referências ARIA existentes, imagens locais encontradas e dimensões preservadas |
| Roteamento local | `/index-hive` retorna HTTP 200; `/index-hive.html` é normalizada para `/index-hive` |
| Empacotamento Cloudflare | `npm run check` concluído com 60 arquivos de assets, sem publicação |

Essas verificações confirmam a preservação da apresentação medida e a consistência técnica da cópia. Não foi feita medição de Core Web Vitals em tráfego real nem auditoria de posicionamento, indexação ou citações em plataformas de IA. A validação Schema.org também não substitui a avaliação de elegibilidade do Google Rich Results Test.

**Pendências relevantes para a publicação principal**

- **Alta prioridade:** definir domínio e URL principal; ajustar os metadados absolutos de forma consistente ao promover esta implementação.
- **Média prioridade:** fornecer a imagem social institucional de 1200 × 630. As metatags não apontam mais para uma imagem inexistente, mas a cópia permanece sem imagem social dedicada.
- **Média prioridade:** após definir a principal, preparar um sitemap com URLs canônicas e avaliar `robots.txt`, Search Console e permissões de rastreamento no Cloudflare. Esses arquivos e configurações são globais; não foram alterados nesta duplicação.
- **Editorial:** o destino `#newsletter` continua sem formulário/âncora correspondente, e duas áreas continuam com imagens pendentes. Esses elementos já existiam e precisam de conteúdo aprovado para serem resolvidos.
- **GEO editorial:** transcrição do vídeo e referências verificáveis para afirmações quantitativas podem tornar o conteúdo mais útil e citável, mas exigiriam ampliar o conteúdo visível. Não foram incluídas nesta etapa.

**Evidências locais:** [comparação estrutural](C:/Users/benet/.codex/visualizations/2026/10/16/01a14612-bc37-77d2-b2f7-cdbd19f98241/index-hive-validation.json), [comparação no navegador](C:/Users/benet/.codex/visualizations/2026/10/16/01a14612-bc37-77d2-b2f7-cdbd19f98241/index-hive-render-validation.json), [tela desktop](C:/Users/benet/.codex/visualizations/2026/10/16/01a14612-bc37-77d2-b2f7-cdbd19f98241/index-hive-desktop.png), [tela de celular](C:/Users/benet/.codex/visualizations/2026/10/16/01a14612-bc37-77d2-b2f7-cdbd19f98241/index-hive-mobile.png) e [validação Schema.org](C:/Users/benet/.codex/visualizations/2026/10/16/01a14612-bc37-77d2-b2f7-cdbd19f98241/index-hive-schema-validation.png).
