import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { buildSite, projectDir } from './build.mjs';

const contact = 'equipe@example.test';

async function output(t) {
  const parent = join(projectDir, '.wrangler');
  await mkdir(parent, { recursive: true });
  const path = await mkdtemp(join(parent, 'build-test-'));
  t.after(async () => {
    // Confere o alvo absoluto antes de limpar somente o diretório deste teste.
    assert(relative(projectDir, path).startsWith(`.wrangler${sep}build-test-`));
    await rm(path, { recursive: true, force: true });
  });
  return path;
}

test('o domínio e o contato vêm do ambiente em todos os arquivos gerados', async t => {
  const sourceBefore = await readFile(join(projectDir, 'public/index.html'), 'utf8');
  const target = await output(t);
  for (const site of ['https://producao.example.test', 'https://preview.example.test:8443']) {
    await buildSite({ env: { SITE_URL: site + '/', CONTACT_EMAIL: contact }, outputDir: target });
    const html = await readFile(join(target, 'index.html'), 'utf8');
    assert(html.includes(`<link rel="canonical" href="${site}/">`));
    assert(html.includes(`<meta property="og:url" content="${site}/">`));
    assert(html.includes(`<span>${new URL(site).hostname}</span>`));
    assert(html.includes(`href="mailto:${contact}"`));
    assert(!/\{\{[A-Z_]+\}\}|workers\.dev|\/index-cme/.test(html));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const page = schema['@graph'].find(node => node['@type'] === 'WebPage');
    assert.equal(page.url, site + '/');
    for (const node of schema['@graph']) assert(node['@id'].startsWith(site + '/'));
    assert((await readFile(join(target, 'sitemap.xml'), 'utf8')).includes(`<loc>${site}/</loc>`));
    assert((await readFile(join(target, 'robots.txt'), 'utf8')).includes(`Sitemap: ${site}/sitemap.xml`));
  }
  assert.equal(await readFile(join(projectDir, 'public/index.html'), 'utf8'), sourceBefore);
});

test('a build publica só a nova inicial e mantém os ajustes mais recentes da Beatriz', async t => {
  const target = await output(t);
  await mkdir(join(target, 'old/historico'), { recursive: true });
  await writeFile(join(target, 'old/historico/index-cme.html'), 'artefato obsoleto');
  await writeFile(join(target, 'index-hive.html'), 'artefato obsoleto');
  await buildSite({ env: { SITE_URL: 'https://preview.example.test', CONTACT_EMAIL: contact }, outputDir: target });
  const files = await readdir(target);
  assert.deepEqual(files.filter(file => file.endsWith('.html')).sort(), ['404.html', 'index.html']);
  for (const excluded of ['old', 'historico', 'index-hive.html', 'index-cme.html', '.env.local']) {
    assert(!files.includes(excluded), excluded);
  }
  const html = await readFile(join(target, 'index.html'), 'utf8');
  const names = ['Lennon Medeiros', 'Sabine Bolonhini', 'Fabíola Zerbini', 'Ronaldo Matos'];
  const positions = names.map(name => html.indexOf(`<span class="name">${name}</span>`));
  assert(positions.every(index => index >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert(html.includes('Além de nos apoiar a ampliar parcerias com atores-chave'));
  assert(html.includes('id="depo-trilho"'));
  assert(html.includes('assets/img/orquestradores-de-sistemas.webp'));
  assert(!html.includes('Espaço reservado para imagem'));
  for (const file of ['motion.css', 'motion.js', 'assets/img/orquestradores-de-sistemas.webp', 'assets/img/depoimento-lennon-medeiros.webp', 'assets/img/depoimento-sabine-bolonhini.webp']) {
    assert((await stat(join(target, file))).isFile(), file);
  }
  const redirects = await readFile(join(target, '_redirects'), 'utf8');
  assert.match(redirects, /\/index-hive\s+\/\s+301/);
  assert.match(redirects, /\/index-cme\s+\/\s+301/);
  assert(!/^\/\s+\S+/m.test(redirects));
  assert((await readFile(join(target, '404.html'), 'utf8')).includes('href="/"'));
});

test('configuração inválida falha antes de alterar a saída ou publicar uma URL de fallback', async t => {
  const target = await output(t);
  const valid = { SITE_URL: 'https://preview.example.test', CONTACT_EMAIL: contact };
  await buildSite({ env: valid, outputDir: target });
  const previous = await readFile(join(target, 'index.html'), 'utf8');
  for (const site of ['', 'invalid', 'http://public.example.test', 'https://example.test/path', 'https://example.test/?x=1', 'https://example.test/#x', 'https://user:pass@example.test']) {
    await assert.rejects(buildSite({ env: { ...valid, SITE_URL: site }, outputDir: target }), /SITE_URL/);
  }
  await assert.rejects(buildSite({ env: { ...valid, CONTACT_EMAIL: '' }, outputDir: target }), /CONTACT_EMAIL/);
  await assert.rejects(buildSite({ env: valid, outputDir: projectDir }), /Diretório de saída/);
  assert.equal(await readFile(join(target, 'index.html'), 'utf8'), previous);
});
