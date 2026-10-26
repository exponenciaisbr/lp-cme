# Publicação do CMe

A página principal está em `public/index.html`. O build resolve as variáveis de
ambiente e grava somente os arquivos publicáveis em `dist/`. O histórico está em
`old/historico/` e nunca é copiado para a publicação.

## Ambiente local

Use Node.js 22.9 ou superior. Instale as dependências e copie o modelo:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Preencha `.env.local` com os valores do ambiente:

```dotenv
SITE_URL=https://example.org
CONTACT_EMAIL=contato@example.org
```

`SITE_URL` aceita uma origem HTTPS, sem caminho, parâmetros ou fragmento. A barra
final é normalizada. HTTP é aceito somente para desenvolvimento em localhost.
A mesma variável alimenta canonical, Open Graph, JSON-LD, sitemap, robots e o
hostname exibido no rodapé. `CONTACT_EMAIL` alimenta texto, links e dados estruturados.
O arquivo local é ignorado pelo Git. Variáveis fornecidas pelo processo ou pelo CI
têm precedência sobre os valores do arquivo.

Como o site é estático, essas variáveis são usadas **durante o build**. Alterar
somente variáveis de runtime no painel Cloudflare não modifica o HTML já publicado.
Os endereços absolutos finais aparecem nos arquivos gerados, derivados do ambiente.

## Verificar e visualizar

```powershell
npm test
npm run build
npm run check
npm run dev
```

`npm test` testa troca de domínio, validação das variáveis, exclusão do histórico e
preservação dos ajustes editoriais. `npm run check` executa o build e um dry-run do
Wrangler. `npm run dev` também gera a build e abre o servidor local, normalmente em
http://localhost:8787/. Os caminhos antigos redirecionam para a raiz com HTTP 301.

## GitHub Actions

Em **Settings → Secrets and variables → Actions**, mantenha:

| Tipo | Nome | Uso |
|---|---|---|
| Variable | `SITE_URL` | Origem pública do ambiente |
| Variable | `CONTACT_EMAIL` | Contato institucional |
| Secret | `CLOUDFLARE_API_TOKEN` | Publicação do Worker |

As duas variáveis já foram cadastradas no repositório durante esta preparação.
O segredo de deploy já existia. O workflow `.github/workflows/deploy.yml` recebe
as variáveis, executa os testes e publica a cada push na `main`. Também aceita
execução manual pela aba Actions. Nenhum valor de domínio é fixado no workflow.

## Ativar o domínio de produção

1. Confirmar que a zona do hostname definido em `SITE_URL` está ativa na conta
   Cloudflare utilizada pelo projeto e que os nameservers estão delegados corretamente.
2. No Worker **lp-cme → Domains → Add → Custom domain**, cadastrar o hostname de
   `SITE_URL`. A Cloudflare gerencia a associação DNS e o certificado. Verificar
   antes se há registros existentes que entram em conflito.
3. Confirmar que o domínio resolve publicamente e que o certificado está ativo.
4. Publicar a build e verificar a raiz, os redirects antigos, canonical, sitemap,
   robots, imagens e navegação no hostname de produção.

Na verificação de 26/10/2026, o hostname de produção não retornou A/AAAA público.
A ativação DNS e a associação do domínio ao Worker precisam ser confirmadas antes
que a publicação possa ser considerada acessível em produção.

O domínio personalizado é administrado no painel, sem `route` ou `routes` fixos
no Wrangler. Assim, trocar `SITE_URL` não altera DNS nem reassocia domínios
automaticamente. A configuração de rotas no painel é suportada pelo
[Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).
Para criar ou modificar essa associação são necessárias permissões na zona; o
token do CI permanece restrito à publicação do Worker existente.

## Publicar pelo computador

```powershell
npx wrangler whoami
npm run deploy
```

Se necessário, autentique com `npx wrangler login`. O projeto aponta para a conta
Cloudflare já configurada. O Wrangler sempre executa `npm run build` antes do upload,
inclusive quando chamado diretamente. O diretório publicado é `dist/`.

Para conferir ou desfazer uma publicação:

```powershell
npx wrangler deployments list
npx wrangler rollback
```
