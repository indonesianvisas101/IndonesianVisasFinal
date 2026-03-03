import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/en/login');

    // Fill login
    await page.fill('input[type="email"]', 'damnbayu@gmail.com');
    await page.fill('input[type="password"]', 'indonesianvisas2024');
    await page.click('button:has-text("Sign in")');
    console.log("Logged in");

    // Wait for redirect to admin or dashboard
    await page.waitForTimeout(3000);

    console.log("Navigating to Admin Arrival Cards Tab...");
    await page.goto('http://localhost:3000/en/admin?tab=arrival_cards');

    await page.waitForTimeout(4000); // give time for the API to fetch data

    const path = 'artifacts/arrival_cards_dashboard.png';
    await page.screenshot({ path, fullPage: true });
    console.log(`Screenshot saved to ${path}`);

    await browser.close();
})();
