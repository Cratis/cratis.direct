// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Captures the product screenshots in assets/img from production Direct, signed in as you, read-only.
//
//   1. In the Direct repository:   scripts/production-direct-proxy.sh 15057     (leave it running)
//   2. Here:                       npm i --no-save playwright-core
//                                  CHROME=/path/to/chrome node scripts/capture-screenshots.mjs
//
// CHROME defaults to the Chromium that Playwright installed under ~/Library/Caches/ms-playwright (macOS).
// BASE defaults to http://127.0.0.1:15057. Review every image for private repositories, tokens and spend
// before committing: none of this redacts anything.

import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.BASE ?? 'http://127.0.0.1:15057';
const out = new URL('../assets/img/', import.meta.url).pathname;

const findChrome = () => {
    if (process.env.CHROME) return process.env.CHROME;
    const root = join(homedir(), 'Library/Caches/ms-playwright');
    const dir = readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop();
    return join(root, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
};

const browser = await chromium.launch({ executablePath: findChrome() });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const go = async (path, wait = 11000) => { await page.goto(`${base}/${path}`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(wait); };
const shot = async (name, clip) => { await page.screenshot({ path: `${out}${name}.png`, clip }); console.log('captured', name); };
const click = async (locator, wait = 4000) => { await locator.click({ timeout: 8000 }); await page.waitForTimeout(wait); };

await go('global');                    await shot('today');
await go('product/journeys');          await shot('journeys');
await click(page.locator('text=Improve intake gating').first());
await shot('journey-detail', { x: 0, y: 0, width: 1440, height: 640 });   // cropped above the work artifact body
await go('product/adlc-designer');
await click(page.getByText('16 rules').first(), 2500);                    // gate G04, Implementation quality
await shot('designer-gate');
await click(page.getByRole('button', { name: /Simulate/ }), 3500);        // opening the dialog only: running it is a write
await shot('designer-simulate');
await go('product/issues');            await shot('issues');
await go('product/stories');
await click(page.locator('text=Collaboration - publish app').first(), 8000);  await shot('story');
await go('product/inbox');
await click(page.locator('text=Reactor misses events').first(), 6000);    await shot('inbox');
await go('product/learning');          await shot('learning');
await go('product/digest');            await shot('digest');
await go('product/products');          await shot('products');
await go('product/pull-requests');
await click(page.locator('text=Honour key erasure').first(), 6000);       await shot('pull-requests');

await browser.close();
