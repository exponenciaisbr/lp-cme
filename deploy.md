# Publicando a landing do CMe (lp-cme)

A página roda na Cloudflare como um Worker com arquivos estáticos (sem código de servidor).
O plano gratuito cobre com folga: hospedagem estática ilimitada, SSL incluso e 100 mil
requisições por dia. O único custo possível é o domínio próprio, se ainda não tiver um.

## Antes de começar

- Node.js 20 ou superior (confira com `node -v`)
- Conta na Cloudflare, gratuita: https://dash.cloudflare.com/sign-up

## 1. Instalar as dependências

```bash
npm install
```

Instala o Wrangler, a ferramenta oficial da Cloudflare, dentro do projeto.

## 2. Entrar na conta Cloudflare

```bash
npx wrangler login
```

Abre o navegador para você autorizar. Para conferir em qual conta está logado:

```bash
npx wrangler whoami
```

## 3. Ver no seu computador

```bash
npm run dev
```

Abra http://localhost:8787/index-cme. Para parar, `Ctrl+C` no terminal.

## 4. Conferir sem publicar

```bash
npm run check
```

Simula a publicação e mostra quantos arquivos seriam enviados. Não envia nada.

## 5. Publicar

```bash
npm run deploy
```

Publica o Worker `lp-cme` na conta Cloudflare de governanca@exponenciais.org.br.
O endereço é `https://lp-cme.governanca-c8e.workers.dev/index-cme`.

## Publicação automática pela `main`

O workflow `.github/workflows/deploy.yml` executa `npm run deploy` a cada push na
branch `main`. Ele também pode ser iniciado manualmente na aba **Actions** do GitHub.
Para funcionar, o repositório precisa ter o segredo `CLOUDFLARE_API_TOKEN` com um
token de API da Cloudflare limitado à conta acima e com permissão para editar Workers.
O ID da conta está em `wrangler.jsonc`; nunca coloque o token no repositório.

## 6. Domínio próprio (opcional)

No painel da Cloudflare: **Workers & Pages → lp-cme → Settings → Domains & Routes → Add →
Custom domain** e informe o domínio (ex.: `exponenciais.org.br`). O domínio precisa estar
gerenciado pela Cloudflare.

Se a página for morar num domínio que já tem outro site, use **Route** em vez de Custom domain,
com o padrão `exponenciais.org.br/index-cme*`. Nesse caso, acrescente também a rota
`exponenciais.org.br/assets/*`, onde ficam as fontes e imagens.

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npx wrangler tail` | mostra ao vivo as requisições e erros do site publicado |
| `npx wrangler deployments list` | lista as publicações feitas |
| `npx wrangler rollback` | volta para a publicação anterior |
