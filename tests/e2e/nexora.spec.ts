import { test, expect } from "@playwright/test";

const routes = [
  "/nexora",
  "/nexora/servicios",
  "/nexora/proyectos",
  "/nexora/proyectos/digitalflow",
  "/nexora/nosotros",
  "/nexora/contacto",
];
for (const width of [1440, 768, 390]) {
  test(`six routes at ${width}px remain readable without hydration errors`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 960 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("main")).not.toHaveText("");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route,
      ).toBe(true);
      await page.screenshot({
        path: `test-results/nexora-${route.split("/").filter(Boolean).join("-")}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}
test("mobile menu, filters, mockup and project 404 work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/nexora");
  await page.getByRole("button", { name: /menú/i }).click();
  await page
    .getByRole("navigation", { name: /móvil/i })
    .getByRole("link", { name: "Sobre Nexora" })
    .click();
  await expect(page).toHaveURL(/\/nexora\/nosotros$/);
  await page.goto("/nexora/proyectos");
  await page.getByRole("button", { name: /^SaaS/ }).click();
  await expect(
    page.getByRole("heading", { name: "DigitalFlow", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /guitarra/i })).toHaveCount(0);
  await page.goto("/nexora/proyectos/digitalflow");
  await page.getByRole("button", { name: /mobile|móvil/i }).click();
  await expect(
    page.getByRole("button", { name: /mobile|móvil/i }),
  ).toHaveAttribute("aria-pressed", "true");
  expect((await page.goto("/nexora/proyectos/no-existe"))?.status()).toBe(404);
});
for (const width of [1440, 390]) {
  test(`quote prepares WhatsApp without email services at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 960 });
    const apiCalls: string[] = [];
    page.on("request", (request) => {
      if (
        /\/api\/nexora\/presupuesto|turnstile|resend|upstash/.test(
          request.url(),
        )
      )
        apiCalls.push(request.url());
    });
    await page.goto("/nexora/contacto?tipo=saas");
    await expect(
      page.locator("input[name=projectType][value=saas]"),
    ).toBeChecked();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await expect(page.locator("[name=budget]").first()).toBeFocused();
    await page.locator("input[name=budget][value=defined]").check();
    await page
      .locator("textarea[name=description]")
      .fill("Una plataforma para mi equipo");
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.locator("[name=name]").fill("Ana Pérez");
    await page.getByRole("button", { name: "Volver", exact: true }).click();
    await expect(page.locator("textarea[name=description]")).toHaveValue(
      "Una plataforma para mi equipo",
    );
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await expect(page.locator("[name=email]")).toHaveValue("");
    await expect(
      page.getByRole("region", { name: "Vista previa del mensaje" }),
    ).toContainText("Una plataforma para mi equipo");
    await expect(page.locator("[name=consent]")).not.toBeChecked();
    const send = page.getByRole("button", { name: "Enviar por WhatsApp" });
    await expect(send).toBeEnabled();
    await page.evaluate(() => {
      window.open = (url) => {
        document.body.dataset.whatsappUrl = String(url);
        return null;
      };
    });
    await send.click();
    await expect(page.locator("[name=consent]")).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-whatsapp-url");
    await page.locator("[name=consent]").check();
    await send.click();
    const target = await page.locator("body").getAttribute("data-whatsapp-url");
    expect(new URL(target!).hostname).toBe("wa.me");
    const direct = await page
      .getByRole("link", { name: "Conversar por WhatsApp" })
      .getAttribute("href");
    expect(new URL(target!).pathname).toBe(new URL(direct!).pathname);
    expect(new URL(target!).searchParams.get("text")).toContain(
      "Tipo de proyecto: SaaS",
    );
    expect(new URL(target!).searchParams.get("text")).toContain("Ana Pérez");
    await expect(page.getByRole("status")).toContainText(
      "El envío se completa en WhatsApp",
    );
    expect(apiCalls).toEqual([]);
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        window.scrollTo({top: 0, behavior: 'instant'});
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({
      path: `test-results/whatsapp-message-${width}.png`,
      fullPage: true,
    });
  });
}
test("reduced motion and JavaScript-free render keep essential content visible", async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/nexora");
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Hablemos de tu proyecto/ }).first(),
  ).toBeVisible();
  await context.close();
});
test("email endpoint stays deferred", async ({ request }) => {
  expect((await request.get("/api/nexora/presupuesto")).status()).toBe(410);
  expect(
    (await request.post("/api/nexora/presupuesto", { data: {} })).status(),
  ).toBe(410);
});
test("portfolio retains sections, CV and commercial navigation; Studio is available", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator("#projects")).toBeAttached();
  await expect(page.locator('nav a[href="/nexora"]').first()).toBeVisible();
  await expect(page.locator('nav a[href="/nexora"]').first()).toBeInViewport({
    timeout: 60000,
  });
  const cv = page.getByRole("button", { name: /Descargar CV/ }).first();
  await expect(cv).toBeAttached();
  await cv.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    window.open = (url) => {
      document.body.dataset.cvUrl = String(url);
      return null;
    };
  });
  await cv.click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-cv-url",
    /cdn\.sanity\.io\/files\//,
  );
  const url = await page.locator("body").getAttribute("data-cv-url");
  expect(url).toContain("cdn.sanity.io/files/");
  const asset = await page.request.get(url!, { timeout: 15000 });
  expect(asset.ok()).toBe(true);
  expect(asset.headers()["content-type"]).toContain("application/pdf");
  expect(
    (await page.goto("/admin", { waitUntil: "domcontentloaded" }))?.status(),
  ).toBe(200);
  const sanityLogin = page.getByRole("link", { name: "Google", exact: true });
  await expect(sanityLogin).toBeVisible({ timeout: 45000 });
  await expect(sanityLogin).toHaveAttribute(
    "href",
    /^https:\/\/api\.sanity\.io\/v1\/auth\/login\/google\?/,
  );
});
