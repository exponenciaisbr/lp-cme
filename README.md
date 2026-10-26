# Landing page do CMe

Página do Centro para Mudanças Exponenciais (CMe), hospedada na Cloudflare e servida
na raiz **`/`**. A página principal é a antiga versão Hive, com os ajustes editoriais
mais recentes da Beatriz. Os endereços anteriores redirecionam para `/` com HTTP 301.

## O que tem aqui

```
public/
├── index.html           # fonte principal; URLs e contato são variáveis de template
├── motion.css           # efeitos e suporte a movimento reduzido
├── motion.js            # entradas e reação ao cursor
├── 404.html              # página de "não encontrada", com botão de volta
├── _redirects           # endereços antigos → /
├── robots.txt           # template com a referência ao sitemap
├── sitemap.xml          # template com apenas a URL principal
├── _headers              # cache longo para fontes e imagens
└── assets/
    ├── fonts/            # JUST Sans (300, 400, 500, 600), fonte oficial da marca
    └── img/              # logos, fotos, capas de livro, favicon
scripts/build.mjs        # gera dist/ a partir de public/ e das variáveis de ambiente
scripts/build.test.mjs   # valida ambiente, artefatos e conteúdo preservado
old/historico/           # versão anterior e relatório histórico; fora da build
dist/                    # arquivos gerados; ignorados pelo Git
.env.example             # modelo das variáveis, sem domínio de produção fixo
wrangler.jsonc           # publica somente dist/; executa o build automaticamente
deploy.md                # configuração e passo a passo de publicação
```

Não há código de servidor. A Cloudflare entrega os arquivos de `dist/`, produzidos
pelo build. O domínio público é definido por `SITE_URL`, e o contato por
`CONTACT_EMAIL`. `.env.local` é ignorado pelo Git; no CI, os valores vêm das
variáveis do repositório no GitHub Actions. Não edite `dist/` manualmente.

## Como trocar um texto

Abra `public/index.html` e procure (Ctrl+F) pelo trecho atual. Cada seção começa com um
comentário fácil de achar, por exemplo `MÓDULO 2 — QUEM SOMOS` ou `MÓDULO 10 — APOIE O CME`.
Troque só o texto entre as tags, sem apagar `<p>`, `</p>`, `<h2>` etc.

## Como trocar uma foto ou logo

1. Salve a nova imagem em `.webp` (ou `.png`/`.jpg`), já no tamanho em que aparece na tela.
2. Coloque em `public/assets/img/` com **um nome novo** (ex.: `equipe-fabio-tran-2026.webp`).
   Nome novo é importante: as imagens ficam guardadas em cache por um ano.
3. No `index.html`, troque o `src="assets/img/..."` correspondente e ajuste `width` e
   `height` para as medidas da nova imagem.

## Ver no seu computador

```bash
npm install
cp .env.example .env.local
npm run dev
```

Antes de iniciar, preencha `SITE_URL` e `CONTACT_EMAIL` em `.env.local`. No
PowerShell, use `Copy-Item .env.example .env.local` para criar esse arquivo.
Abra http://localhost:8787/. O Wrangler executa o build e atualiza a prévia ao
editar os arquivos de `public/` ou `scripts/`. É necessário Node.js 22.9 ou superior.

## Publicar

Veja `deploy.md`. Cada push na `main` executa os testes e publica a página pelo
GitHub Actions. Para conferir sem publicar, use `npm test` e `npm run check`.
Para publicar deste computador, use `npm run deploy`. O build é obrigatório e
interrompe a publicação se as variáveis estiverem ausentes ou inválidas.

## Pendências editoriais

- **Imagem de compartilhamento** (`og-image.jpg`, 1200×630): colocar em `public/og-image.jpg`.
  É ela que aparece quando o link é colado no WhatsApp/LinkedIn.
- **Link da newsletter** no rodapé: hoje aponta para `#newsletter`.
- **URLs dos sites dos parceiros de jornada**: confirmar antes de publicar.
- O domínio é configurado somente por `SITE_URL`. Para a ativação pública, a zona
  deve estar ativa na Cloudflare, com o hostname associado ao Worker `lp-cme`.
