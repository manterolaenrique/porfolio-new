const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
const path = require("node:path");
const sites = [
  { slug: "digitalflow", url: "https://digitalflow-pagos.vercel.app/" },
  {
    slug: "herramientas-de-guitarra",
    url: "https://guitar-app-git.vercel.app/",
  },
  {
    slug: "sitio-para-bandas-musicales",
    url: "https://web-bands-v2.vercel.app/",
  },
];
async function main() {
  const folder = path.resolve(".cache/nexora/mobile");
  await fs.mkdir(folder, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    for (const site of sites) {
      const page = await context.newPage();
      const response = await page.goto(site.url, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      if (!response?.ok())
        throw new Error(
          `No se pudo capturar ${site.slug}: HTTP ${response?.status()}`,
        );
      await page.evaluate(() => document.fonts.ready);
      const title = await page.title();
      if (/login.*vercel|authentication required/i.test(title))
        throw new Error(
          `La demo ${site.slug} requiere autenticación; no se capturó.`,
        );
      await page.screenshot({
        path: path.join(folder, `${site.slug}.png`),
        animations: "disabled",
      });
      results.push({
        ...site,
        title,
        capturedAt: new Date().toISOString(),
        width: 390,
        height: 844,
        file: `${site.slug}.png`,
      });
      await page.close();
    }
    await fs.writeFile(
      path.join(folder, "manifest.json"),
      JSON.stringify(results, null, 2),
    );
    console.log(
      "Capturas móviles reales disponibles:",
      results.map((item) => item.slug).join(", "),
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
