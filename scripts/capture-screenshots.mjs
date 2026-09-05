/**
 * Captures a screenshot of every screen in the app for the README.
 *
 * Usage:
 *   npm i -D playwright && npx playwright install chromium
 *   SCREENSHOT_EMAIL=you@example.com SCREENSHOT_PASSWORD=... node scripts/capture-screenshots.mjs
 *
 * Credentials come from the environment on purpose — never commit a real account
 * into the repo. Point BASE_URL at localhost to shoot a dev build instead of prod.
 *
 * Detail pages (a document, a conversation) need real data in the account, so
 * their URLs are discovered by reading the first link out of the list page rather
 * than being hardcoded. If the account has no documents or conversations those two
 * shots are skipped with a warning instead of failing the run.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "https://frontend-doc-mind-ai.vercel.app";
const EMAIL = process.env.SCREENSHOT_EMAIL;
const PASSWORD = process.env.SCREENSHOT_PASSWORD;
const OUT_DIR = path.resolve(process.env.SCREENSHOT_DIR ?? "../docs/screenshots");

// A 16:10 desktop frame — wide enough for the sidebar plus content, and it crops
// predictably into a README table.
const VIEWPORT = { width: 1600, height: 1000 };

if (!EMAIL || !PASSWORD) {
  console.error("Set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD before running.");
  process.exit(1);
}

/** Waits for the network to settle, then for animations to land. */
async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1200);
}

async function shoot(page, name, { fullPage = false } = {}) {
  await settle(page);
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  console.log(`captured ${name}.png`);
}

/** Returns the href of the first link matching prefix, or null if there is none. */
async function firstHref(page, prefix) {
  const link = page.locator(`a[href^="${prefix}"]`).first();
  if ((await link.count()) === 0) return null;
  return link.getAttribute("href");
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
const page = await context.newPage();

try {
  await mkdir(OUT_DIR, { recursive: true });

  // ── Public pages ────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await shoot(page, "01-landing", { fullPage: true });

  await page.goto(`${BASE_URL}/register`, { waitUntil: "domcontentloaded" });
  await shoot(page, "02-register");

  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await shoot(page, "03-login");

  // ── Sign in ─────────────────────────────────────────────────────
  // The API may be cold-starting on a free instance, so allow a generous wait
  // for the redirect rather than the default 30s.
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 120_000 });

  // ── Authenticated pages ─────────────────────────────────────────
  await shoot(page, "04-dashboard");

  await page.goto(`${BASE_URL}/documents`, { waitUntil: "domcontentloaded" });
  await shoot(page, "05-documents");

  const documentHref = await firstHref(page, "/documents/");
  if (documentHref) {
    await page.goto(`${BASE_URL}${documentHref}`, { waitUntil: "domcontentloaded" });
    await shoot(page, "06-document-detail");
  } else {
    console.warn("skipped 06-document-detail — the account has no documents");
  }

  await page.goto(`${BASE_URL}/chat`, { waitUntil: "domcontentloaded" });
  await shoot(page, "07-chat");

  const conversationHref = await firstHref(page, "/chat/");
  if (conversationHref) {
    await page.goto(`${BASE_URL}${conversationHref}`, { waitUntil: "domcontentloaded" });
    await shoot(page, "08-chat-conversation");
  } else {
    console.warn("skipped 08-chat-conversation — the account has no conversations");
  }

  await page.goto(`${BASE_URL}/settings`, { waitUntil: "domcontentloaded" });
  await shoot(page, "09-settings");

  console.log(`\nDone — screenshots are in ${OUT_DIR}`);
} finally {
  await browser.close();
}
