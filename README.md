# Landing page do CMe

Página do Centro para Mudanças Exponenciais (CMe), hospedada na Cloudflare e servida no
endereço **`/index-cme`**. Quem acessa a raiz do site (`/`) é levado automaticamente para ela.

## O que tem aqui

```
public/
├── index-cme.html        # a página inteira (textos, estilos e o pequeno script do menu)
├── motion.css            # efeitos visuais, estados interativos e movimento reduzido
├── motion.js             # entradas ao rolar e reação da abertura ao cursor
├── 404.html              # página de "não encontrada", com botão de volta
├── _redirects            # / → /index-cme
├── _headers              # cache longo para fontes e imagens
└── assets/
    ├── fonts/            # JUST Sans (300, 400, 500, 600), fonte oficial da marca
    └── img/              # logos, fotos, capas de livro, favicon
wrangler.jsonc            # configuração da Cloudflare (nome do projeto: lp-cme)
package.json              # comandos: dev, check, deploy
deploy.md                 # passo a passo para publicar
```

Não há código de servidor: a Cloudflare só entrega os arquivos de `public/`.

## Como trocar um texto

Abra `public/index-cme.html` e procure (Ctrl+F) pelo trecho atual. Cada seção começa com um
comentário fácil de achar, por exemplo `MÓDULO 2 — QUEM SOMOS` ou `MÓDULO 10 — APOIE O CME`.
Troque só o texto entre as tags, sem apagar `<p>`, `</p>`, `<h2>` etc.

## Como trocar uma foto ou logo

1. Salve a nova imagem em `.webp` (ou `.png`/`.jpg`), já no tamanho em que aparece na tela.
2. Coloque em `public/assets/img/` com **um nome novo** (ex.: `equipe-fabio-tran-2026.webp`).
   Nome novo é importante: as imagens ficam guardadas em cache por um ano.
3. No `index-cme.html`, troque o `src="/assets/img/..."` correspondente e ajuste `width` e
   `height` para as medidas da nova imagem.

## Ver no seu computador

```bash
npm install
npm run dev
```

Abra http://localhost:8787/index-cme.

## Publicar

Veja `deploy.md`. Cada push na `main` publica a página pelo GitHub Actions. Para
publicar diretamente deste computador, use `npm run deploy`.

## O que não mexer

- `wrangler.jsonc`, `_redirects` e `_headers`, a não ser que queira mudar o endereço ou o cache.
- Os blocos `@font-face` no topo do HTML.

## Pendências (já estavam marcadas no HTML original)

- **Imagem de compartilhamento** (`og-image.jpg`, 1200×630): colocar em `public/og-image.jpg`.
  É ela que aparece quando o link é colado no WhatsApp/LinkedIn.
- **Imagem da seção "Por que agir agora?"**: hoje é um espaço reservado.
- **Imagem da seção "Orquestradores de Sistemas"**: hoje é um espaço reservado.
- **Link da newsletter** no rodapé: hoje aponta para `#newsletter`.
- **URLs dos sites dos parceiros de jornada**: confirmar antes de publicar.
- **Domínio**: as metatags de compartilhamento usam `https://exponenciais.org.br/index-cme`.
  Se a página for publicada em outro domínio, trocar `og:url`, `og:image` e `twitter:image`.
