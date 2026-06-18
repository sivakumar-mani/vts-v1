const puppeteer = require('C:\\Users\\SELVI~1.MAN\\AppData\\Local\\Temp\\pup\\node_modules\\puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS = 'C:\\Users\\selvi.mani\\AppData\\Local\\Temp\\vts-screenshots';
if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS, { recursive: true });

const BASE = 'http://localhost:4200';

let browser, page;
const findings = [];
const steps = [];

function log(icon, desc, detail) {
  const entry = `${icon} ${desc}${detail ? ' → ' + detail : ''}`;
  steps.push(entry);
  console.log(entry);
}

async function shot(name) {
  const file = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function waitAndGet(selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return await page.$(selector);
  } catch (e) { return null; }
}

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  page = await browser.newPage();
  page._consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      page._consoleErrors.push(msg.text());
      console.log('[CONSOLE ERROR]', msg.text().substring(0, 150));
    }
  });
  const networkErrors = [];
  const requestLog = [];
  page.on('requestfailed', req => {
    const err = `${req.method()} ${req.url().replace(BASE,'')} → ${req.failure().errorText}`;
    networkErrors.push(err);
    console.log('[NET FAIL]', err);
  });
  page.on('request', req => {
    if (!req.url().includes('localhost:4200') || req.url().includes('/api/')) {
      requestLog.push(`${req.method()} ${req.url().replace(BASE,'').replace('http://localhost:62414','API')}`);
    }
  });

  await page.setViewport({ width: 1280, height: 800 });

  // ─── 1: APP BOOTSTRAP ────────────────────────────────────────────────────
  console.log('\n── TEST 1: App Bootstrap ──');
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 25000 });
  const title = await page.title();
  log('✅', 'App loaded', `title="${title}"`);
  await shot('01-landing');

  // Check spinner stuck on landing
  const spinnerState = await page.evaluate(() => {
    const s = document.querySelector('ngx-spinner');
    if (!s) return 'not-in-dom';
    const inner = s.querySelector('.ngx-overlay');
    if (!inner) return 'no-overlay';
    const style = window.getComputedStyle(inner);
    return style.display === 'none' || style.opacity === '0' || style.visibility === 'hidden' ? 'hidden' : 'VISIBLE';
  });
  if (spinnerState === 'VISIBLE') {
    log('⚠️', 'SPINNER STUCK on landing page', 'spinnerLoader.show() called, hide() is commented out in app.component.ts:87-90');
    findings.push('⚠️  SPINNER: ngOnInit calls spinnerLoader.show() with no hide() — spinner is visible on landing with no active request. Users see permanent loading indicator.');
  } else {
    log('✅', 'Spinner state on landing', spinnerState);
  }

  // Check for double index.html comment (already visible in source)
  const pageSource = await page.content();
  if (pageSource.includes('<!-- <!doctype html>')) {
    log('⚠️', 'index.html has commented-out duplicate HTML at the top', 'dead markup in prod HTML');
    findings.push('⚠️  index.html contains a fully commented-out duplicate of the entire HTML document at the top of the file. Adds ~600 bytes of dead markup to every page load.');
  }

  // ─── 2: LOGIN PAGE ───────────────────────────────────────────────────────
  console.log('\n── TEST 2: Login Page ──');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
  await shot('02-login');
  const inputs = await page.$$('input');
  log('✅', `Login page has ${inputs.length} input field(s)`, '');

  // Check caps lock directive
  const hasCapsLockDirective = await page.$('[appCapsLock], [capsLock]') !== null;
  log('🔍', 'Caps-lock directive present', String(hasCapsLockDirective));

  // ─── 3: EMPTY SUBMIT ─────────────────────────────────────────────────────
  console.log('\n── TEST 3: Empty Submit Validation ──');
  const btn = await page.$('button[type="submit"]') || await page.$('button.mat-button') || await page.$('button');
  if (btn) {
    const btnText = await page.evaluate(el => el.textContent.trim(), btn);
    log('🔍', `Found button: "${btnText}"`, '');
    await btn.click();
    await page.waitForTimeout(800);
    await shot('03-empty-submit');

    const matErrors = await page.$$eval('mat-error', els =>
      els.map(e => e.textContent.trim()).filter(Boolean)
    ).catch(() => []);
    const invalidFields = await page.$$eval('input.ng-invalid', els => els.length).catch(() => 0);
    const requiredErrors = await page.$$eval('[class*="ng-invalid"]', els => els.length).catch(() => 0);

    if (matErrors.length > 0) {
      log('✅', `${matErrors.length} mat-error message(s) on empty submit`, matErrors.join(' | '));
    } else if (invalidFields > 0 || requiredErrors > 0) {
      log('⚠️', `${invalidFields} field(s) marked invalid, but 0 mat-error messages visible`, 'validation fires silently');
      findings.push(`⚠️  FORM VALIDATION: Empty submit marks ${invalidFields} field(s) as ng-invalid but shows 0 mat-error messages. Angular marks the state but the template may lack <mat-error> wrappers for these fields.`);
    } else {
      log('⚠️', 'Empty submit shows no validation feedback at all', 'form may not be using reactive validation');
      findings.push('⚠️  FORM VALIDATION: Empty submit on login form produces no visible validation feedback (no mat-error, no ng-invalid class). Login form may lack required validators or error display.');
    }
  }

  // ─── 4: API UNREACHABLE ERROR HANDLING ────────────────────────────────────
  console.log('\n── TEST 4: API Error Handling (backend unreachable) ──');
  const userInput = await page.$('input[type="text"], input[type="email"], input:first-of-type');
  const passInput = await page.$('input[type="password"]');
  if (userInput && passInput) {
    await userInput.click({ clickCount: 3 });
    await userInput.type('testuser');
    await passInput.click({ clickCount: 3 });
    await passInput.type('testpass123');

    const submitBtn = await page.$('button[type="submit"]') || await page.$('button');
    if (submitBtn) {
      const preSubmitErrors = [...page._consoleErrors];
      await submitBtn.click();

      // Wait up to 10s for any feedback
      const result = await Promise.race([
        page.waitForSelector('p-toast .p-toast-message', { timeout: 10000 }).then(() => 'toast'),
        page.waitForSelector('mat-dialog-container', { timeout: 10000 }).then(() => 'dialog'),
        page.waitForSelector('.mat-snack-bar-container', { timeout: 10000 }).then(() => 'snackbar'),
        page.waitForSelector('[class*="error"]', { timeout: 10000 }).then(() => 'error-class'),
        new Promise(r => setTimeout(() => r('timeout'), 10000)),
      ]);

      await shot('04-after-login-attempt');

      // Check spinner state after failed request
      const spinnerAfter = await page.evaluate(() => {
        const s = document.querySelector('ngx-spinner');
        if (!s) return 'not-in-dom';
        const inner = s.querySelector('.ngx-overlay');
        if (!inner) return 'no-overlay';
        const style = window.getComputedStyle(inner);
        return style.display === 'none' || style.opacity === '0' ? 'hidden' : 'STUCK';
      });

      const newErrors = page._consoleErrors.filter(e => !preSubmitErrors.includes(e));

      if (result === 'timeout') {
        if (spinnerAfter === 'STUCK') {
          log('❌', 'SPINNER STUCK after API failure — user sees permanent loading', `spinner: ${spinnerAfter}`);
          findings.push('❌  ERROR HANDLING: After login attempt with backend unreachable, spinner never hides. The interceptor catchError hides spinner only in its error callback, but if the request itself never fires (connection refused), the Observable completes without reaching catchError. User is stuck with a spinning loader and no message.');
        } else {
          log('⚠️', 'No toast/dialog shown after API failure (10s timeout)', `spinner: ${spinnerAfter}`);
          findings.push('⚠️  ERROR HANDLING: Login attempt with unreachable backend shows no user-facing error message after 10 seconds. The interceptor handles HttpErrorResponse but connection-refused may not produce one.');
        }
      } else {
        const toastText = await page.$$eval('p-toast .p-toast-summary, p-toast .p-toast-detail',
          els => els.map(e => e.textContent.trim()).filter(Boolean)
        ).catch(() => []);
        log('✅', `Error feedback shown (${result})`, toastText.join(' — ') || '(text not captured)');
      }

      if (newErrors.length > 0) {
        log('🔍', `${newErrors.length} new console error(s) after login attempt`, newErrors[0].substring(0,120));
      }
    }
  } else {
    log('⚠️', 'Could not locate login form inputs', 'skipping API error test');
  }

  // ─── 5: GUARD — NO SESSION ───────────────────────────────────────────────
  console.log('\n── TEST 5: Guard — Unauthenticated Access ──');
  await page.evaluate(() => sessionStorage.clear());
  const navEvents5 = [];
  const navListener = frame => { if (frame === page.mainFrame()) navEvents5.push(frame.url()); };
  page.on('framenavigated', navListener);

  await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'networkidle2', timeout: 10000 });
  const url5 = page.url();
  await shot('05-guard-no-session');
  page.off('framenavigated', navListener);

  if (url5.includes('/login')) {
    log('✅', 'Guard correctly redirected unauthenticated user to /login', url5);
    // Check for double-navigate
    const loginNavs = navEvents5.filter(u => u.includes('/login'));
    if (loginNavs.length >= 2) {
      log('⚠️', `Double-navigate bug: /login triggered ${loginNavs.length} times`, 'guard calls router.navigate(["/login"]) twice (lines 43-44)');
      findings.push(`⚠️  GUARD BUG: CanactivateGuard called router.navigate(['/login']) ${loginNavs.length} times. The duplicate call on line 44 of canactivate.guard.ts creates ${loginNavs.length} NavigationStart events, firing the global spinner and route-load handlers twice per guard evaluation.`);
    } else {
      log('🔍', `Navigate-to-login count: ${loginNavs.length}`, 'double-navigate may be deduplicated by router');
    }
  } else {
    log('❌', `Guard FAILED — unauthenticated user reached ${url5}`, '');
    findings.push(`❌  GUARD: Unauthenticated navigation to /dashboard/home was not redirected. Current URL: ${url5}`);
  }

  // ─── 6: GUARD — FAKE TOKEN (validates token presence, not signature) ──────
  console.log('\n── TEST 6: Guard — Fake Token ──');
  await page.evaluate(() => {
    sessionStorage.setItem('user_data', JSON.stringify({
      auth_token: 'this.is.a.fake.token',
      userId: 99,
      firstName: 'Fake', lastName: 'User',
      applicationId: 1, teamId: 1, deptId: 1, logId: 1
    }));
    sessionStorage.setItem('user_roles', JSON.stringify([{
      routingUrl: '/dashboard/home',
      screenName: 'Home', moduleName: 'Dashboard', subModuleName: '',
      addFlag: true, editFlag: true, deleteFlag: true, viewFlag: true,
      moduleId: 1, subModuleId: 0, screenId: 1,
      displayOrder: 1, moduleDisplayOrder: 1, subModuleDisplayOrder: 1
    }]));
  });
  await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'networkidle2', timeout: 15000 });
  const url6 = page.url();
  await shot('06-fake-token');

  if (url6.includes('/dashboard')) {
    log('⚠️', 'Guard passed with fake JWT — dashboard shell rendered', 'guard only checks sessionStorage presence, not token validity');
    findings.push('⚠️  SECURITY: CanactivateGuard only checks that auth_token is non-null in sessionStorage. A fake/expired token passes the guard. Token validity is deferred until the first API call returns 401. The dashboard shell (menu, layout, nav) renders with invalid credentials.');

    // Check for JS errors from dashboard init
    await page.waitForTimeout(2000);
    const dashErrors = page._consoleErrors;
    if (dashErrors.length > 0) {
      log('🔍', `${dashErrors.length} console error(s) during dashboard init with fake token`, '');
      dashErrors.slice(0,3).forEach(e => console.log('  ERR:', e.substring(0,150)));
    }

    // Check what API calls were attempted
    const apiCalls = requestLog.filter(r => r.includes('API'));
    if (apiCalls.length > 0) {
      log('🔍', `${apiCalls.length} API call(s) fired with fake token`, apiCalls.slice(0,3).join(', '));
    }
  } else {
    log('✅', 'Fake token was rejected and redirected', url6);
  }

  // ─── 7: DIALOG CONTENT ───────────────────────────────────────────────────
  console.log('\n── TEST 7: Dialog / Alert Content ──');
  // Navigate to a guarded route without permission to trigger the "no permission" dialog
  await page.evaluate(() => {
    sessionStorage.setItem('user_data', JSON.stringify({
      auth_token: 'fake', userId: 1, firstName: 'T', lastName: 'U',
      applicationId: 1, teamId: 1, deptId: 1
    }));
    // Set roles that don't include a specific route
    sessionStorage.setItem('user_roles', JSON.stringify([{
      routingUrl: '/dashboard/home',
      screenName: 'Home', moduleName: 'Dashboard', subModuleName: '',
      addFlag: true, editFlag: true, deleteFlag: true, viewFlag: true,
      moduleId: 1, subModuleId: 0, screenId: 1,
      displayOrder: 1, moduleDisplayOrder: 1, subModuleDisplayOrder: 1
    }]));
  });
  // Navigate to a route not in user_roles
  await page.goto(`${BASE}/dashboard/master/sitelist`, { waitUntil: 'networkidle2', timeout: 10000 });
  await page.waitForTimeout(1500);
  await shot('07-no-permission');

  const dialog = await page.$('mat-dialog-container');
  if (dialog) {
    const dialogText = await page.$eval('mat-dialog-container', el => el.textContent.trim()).catch(() => '');
    log('✅', 'No-permission dialog shown', dialogText.substring(0, 120));
    if (dialogText.toLowerCase().includes('permission')) {
      log('✅', 'Dialog contains "permission" text', '');
    } else {
      log('⚠️', 'Dialog shown but text does not mention "permission"', dialogText.substring(0,80));
    }
  } else {
    log('⚠️', 'No dialog shown for unauthorised route access', 'guard may not have fired or dialog was closed');
  }

  // ─── 8: SCROLL-TO-TOP BUTTON ─────────────────────────────────────────────
  console.log('\n── TEST 8: Scroll Listener ──');
  try {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 10000 });
    // Scroll down to trigger the window:scroll HostListener
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    const scrollButton = await page.$('.scrollUp, .back-to-top, [class*="scroll"]');
    log('🔍', 'Back-to-top button after scroll', scrollButton ? 'visible' : 'not found (may be in dashboard only)');
  } catch (e) {
    log('⚠️', 'Scroll test', e.message);
  }

  // ─── 9: STATIC ANALYSIS CHECKS ────────────────────────────────────────────
  console.log('\n── TEST 9: Observed Static Behaviors ──');
  // Check that config.json has no ocrRoutes (known issue from auth.service.ts:139)
  const configResp = await page.evaluate(async () => {
    const r = await fetch('/config.json');
    return r.json();
  });
  if (!configResp.ocrRoutes) {
    log('⚠️', 'config.json has no "ocrRoutes" key', 'AuthService.load() sets this.ocrRoutes = config["ocrRoutes"] which will be undefined');
    findings.push('⚠️  CONFIG: config.json does not define "ocrRoutes". AuthService.load() assigns this.ocrRoutes = config["ocrRoutes"] (undefined). Any call to authService.getOCRRoute(key) will throw "Cannot read properties of undefined".');
  } else {
    log('✅', 'config.json has ocrRoutes', '');
  }
  if (configResp.pdfType === '1' || typeof configResp.pdfType === 'string') {
    log('⚠️', `config.json "pdfType" is "${configResp.pdfType}" (string, not object)`, 'auth.service.ts:136 sets this.pdfType = entire config — pdfType is then the full config object');
    findings.push(`⚠️  CONFIG: pdfType in config.json is "${configResp.pdfType}" (a string scalar). authService.load() line 136 sets this.pdfType = the entire config object (bug). Any call to authService.getpdfType(key) will return undefined regardless of the config value.`);
  }

  // ─── FINAL REPORT ─────────────────────────────────────────────────────────
  await browser.close();

  console.log('\n' + '='.repeat(72));
  console.log('STEPS:');
  steps.forEach(s => console.log('  ' + s));
  console.log('\nFINDINGS:');
  if (findings.length === 0) console.log('  None');
  else findings.forEach(f => console.log('  ' + f));
  console.log('='.repeat(72));
  console.log(`Screenshots: ${SCREENSHOTS}`);

})().catch(async err => {
  console.error('\nFATAL:', err.message);
  if (page) await shot('fatal-error').catch(() => {});
  if (browser) await browser.close();
  process.exit(1);
});
