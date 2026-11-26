// Renderiza as capas do blog a partir de scripts/capas/capa.html.
// Precisa de: servidor estático na raiz do portfólio (python3 -m http.server 8765), Playwright e cwebp.
// Uso: PLAYWRIGHT=/caminho/node_modules/playwright node scripts/capas/render.cjs [slug...]
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const { execFileSync } = require('child_process');
const { join } = require('path');
const OUT = join(__dirname, '../../assets/img/blog/capas');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto('http://localhost:8765/scripts/capas/capa.html?s=entrei-em-computacao-sem-saber-programar', { waitUntil: 'networkidle' });
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : await p.evaluate(() => window.SLUGS);
  for (const s of slugs) {
    await p.goto(`http://localhost:8765/scripts/capas/capa.html?s=${s}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const png = join(OUT, `${s}.png`);
    await p.screenshot({ path: png });
    execFileSync('cwebp', ['-quiet', '-q', '82', png, '-o', join(OUT, `${s}.webp`)]);
    // JPG 1200x675 pro og:image (WhatsApp/LinkedIn leem JPG melhor que WebP)
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1200', png, '--out', join(OUT, '../og', `${s}.jpg`)], { stdio: 'ignore' });
    require('fs').unlinkSync(png);
    console.log('capa', s);
  }
  await b.close();
})();
