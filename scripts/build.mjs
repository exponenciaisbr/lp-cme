import { cp, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function settings(env) {
  if (!env.SITE_URL?.trim()) {
    throw new Error('Defina SITE_URL em .env.local ou nas variáveis do ambiente de build.');
  }
  let url;
  try {
    url = new URL(env.SITE_URL.trim());
  } catch {
    throw new Error('SITE_URL precisa ser uma URL absoluta válida.');
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL deve ser uma origem HTTPS, sem credenciais, caminho, consulta ou fragmento. HTTP é permitido somente em localhost.');
  }
  const email = env.CONTACT_EMAIL?.trim();
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new Error('Defina CONTACT_EMAIL com um endereço de contato válido.');
  }
  return { SITE_URL: url.origin, SITE_HOST: url.hostname, CONTACT_EMAIL: email };
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Link simbólico não permitido no build: ${path}`);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

export async function buildSite({ env = process.env, outputDir = join(projectDir, 'dist') } = {}) {
  const values = settings(env);
  const output = resolve(outputDir);
  // Confere o destino absoluto antes de qualquer remoção recursiva.
  const target = relative(projectDir, output);
  if (isAbsolute(target) || (target !== 'dist' && !target.startsWith(`.wrangler${sep}build-test-`))) {
    throw new Error(`Diretório de saída não permitido: ${output}`);
  }
  const existing = await lstat(output).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (existing?.isSymbolicLink()) throw new Error('A saída do build não pode ser um link simbólico.');

  const source = join(projectDir, 'public');
  const sourceFiles = await filesIn(source);
  const texts = new Map();
  for (const file of sourceFiles) {
    if (!/\.(html|xml|txt)$/.test(file)) continue;
    const content = (await readFile(file, 'utf8')).replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
      if (!(key in values)) throw new Error(`Variável de template desconhecida: ${key}`);
      return values[key];
    });
    texts.set(relative(source, file), content);
  }
  await mkdir(output, { recursive: true });
  // Mantém a pasta para permitir builds com o watcher do Wrangler aberto no Windows.
  for (const entry of await readdir(output)) {
    const path = resolve(output, entry);
    if (dirname(path) !== output) throw new Error(`Alvo de limpeza inválido: ${path}`);
    await rm(path, { recursive: true, force: true });
  }
  await cp(source, output, { recursive: true });
  for (const [file, content] of texts) await writeFile(join(output, file), content, 'utf8');
  return { outputDir: output, siteUrl: values.SITE_URL, files: sourceFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await buildSite();
    console.log(`Build concluído: ${result.files} arquivos em ${result.outputDir}. URL canônica: ${result.siteUrl}/`);
  } catch (error) {
    console.error(`Build interrompido: ${error.message}`);
    process.exitCode = 1;
  }
}
