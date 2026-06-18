const puppeteer = require('C:\\Users\\SELVI~1.MAN\\AppData\\Local\\Temp\\pup\\node_modules\\puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS = 'C:\\Users\\selvi.mani\\AppData\\Local\\Temp\\vts-screenshots';
if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS, { recursive: true });

const BASE = 'http://localhost:4200';
let browser, page;

function log(icon, desc, detail) {
  console.log(`${icon} ${desc}${detail ? ' → ' + detail : ''}`);
}
async function shot(name) {
  const file = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  [screenshot: ${file}]`);
}

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  page = await browser.newPage();
  const consoleErrors = [];
  const apiRequests = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('[ERR]', msg.text().substring(0,120));
    }
  });
  page.on('request', req => {
    const url = req.url();
    if (url.includes(':62414') || url.includes(':5003')) {
      apiRequests.push(`${req.method()} ${url.replace('http://localhost:62414/api/','API:').replace('http://localhost:5003/api/','INV:')}`);
    }
  });
  await page.setViewport({ width: 1280, height: 800 });

  // ─── TEST 6: FAKE TOKEN — dashboard init ─────────────────────────────────
  console.log('\n── TEST 6: Fake Token — Dashboard Shell Render ──');
  await page.evaluate(() => {
    sessionStorage.setItem('user_data', JSON.stringify({
      auth_token: 'this.is.a.fake.jwt.token',
      userId: 99, firstName: 'Test', lastName: 'User',
      applicationId: 1, teamId: 1, deptId: 1, logId: 1,
      userDepartmentVm: []
    }));
    sessionStorage.setItem('user_roles', JSON.stringify([{
      routingUrl: '/dashboard/home',
      screenName: 'Home', moduleName: 'Dashboard', subModuleName: '',
      addFlag: true, editFlag: true, deleteFlag: true, viewFlag: true,
      moduleId: 1, subModuleId: 0, screenId: 1,
      displayOrder: 1, moduleDisplayOrder: 1, subModuleDisplayOrder: 1
    }]));
  });

  // Navigate but don't wait for networkidle (API calls will never complete)
  try {
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded', timeout: 8000 });
  } catch (e) {
    // timeout is expected — page loads but API calls block networkidle
    console.log('[INFO] navigation wait timed out (expected — pending API calls to unreachable backend)');
  }
  await page.waitForTimeout(3000);
  const url6 = page.url();
  await shot('06-fake-token-dashboard');

  if (url6.includes('/dashboard')) {
    log('⚠️', 'Dashboard shell rendered with fake JWT', 'guard only checks sessionStorage, not token validity');

    // Check for userData null-deref bug (dashboard.component.ts:107 — firstName before null check)
    const pageErrors = consoleErrors.filter(e => e.includes('firstName') || e.includes('Cannot read') || e.includes('undefined'));
    if (pageErrors.length > 0) {
      log('❌', 'null-deref error on dashboard init', pageErrors[0].substring(0,150));
    }

    // Check spinner state — all those API calls should have triggered show()
    const spinnerState = await page.evaluate(() => {
      const s = document.querySelector('ngx-spinner');
      if (!s) return 'not-in-dom';
      // check body for ngx-spinner backdrop
      const backdrop = document.querySelector('.ngx-overlay.loading-foreground, .ngx-spinner');
      return backdrop ? backdrop.className : 'no-backdrop';
    });
    log('🔍', 'Spinner state after dashboard init with failing API calls', spinnerState);

    const apiCallsMade = apiRequests.length;
    log('🔍', `API calls attempted with fake token: ${apiCallsMade}`, apiRequests.slice(0,5).join(' | '));

    // Check what's visible — does dashboard menu render?
    const menuVisible = await page.$('mat-sidenav, .sidebar, [class*="sidenav"], [class*="nav-menu"]') !== null;
    log('🔍', 'Dashboard sidenav rendered', String(menuVisible));

    // Check if "Home" menu item rendered from the fake roles
    const menuText = await page.$$eval('a, .menu-item, [class*="menu"]', els =>
      els.map(e => e.textContent.trim()).filter(t => t.length > 0 && t.length < 30).slice(0,10)
    ).catch(() => []);
    log('🔍', 'Menu items visible', menuText.join(', ').substring(0,100) || 'none');

  } else {
    log('✅', 'Fake token was rejected', url6);
  }

  // ─── TEST 7: NO-PERMISSION DIALOG ─────────────────────────────────────────
  console.log('\n── TEST 7: No-Permission Dialog ──');
  // Navigate to a route NOT in user_roles
  try {
    await page.goto(`${BASE}/dashboard/master/sitelist`, { waitUntil: 'domcontentloaded', timeout: 8000 });
  } catch (e) { /* timeout expected */ }
  await page.waitForTimeout(2000);
  await shot('07-no-permission');

  const dialog = await page.$('mat-dialog-container');
  if (dialog) {
    const dialogHtml = await page.$eval('mat-dialog-container', el => el.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
    log('✅', 'No-permission dialog shown', dialogHtml.substring(0, 120));

    // Check buttons
    const dialogBtns = await page.$$eval('mat-dialog-container button', els =>
      els.map(e => e.textContent.trim()).filter(Boolean)
    ).catch(() => []);
    log('🔍', 'Dialog buttons', dialogBtns.join(', '));

    // Close dialog and confirm we stay on the same page
    const closeBtn = await page.$('mat-dialog-container button');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      const urlAfterClose = page.url();
      log('🔍', 'URL after closing no-permission dialog', urlAfterClose);
    }
  } else {
    log('⚠️', 'No dialog shown for route not in user_roles', 'guard may have redirected differently');
    log('🔍', 'Current URL', page.url());
  }

  // ─── TEST 8: LOGOUT FLOW ──────────────────────────────────────────────────
  console.log('\n── TEST 8: Logout Flow ──');
  try {
    await page.goto(`${BASE}/dashboard/home`, { waitUntil: 'domcontentloaded', timeout: 8000 });
  } catch (e) { /* timeout */ }
  await page.waitForTimeout(2000);

  // Find logout button
  const logoutBtn = await page.$('[aria-label*="logout"], [title*="logout"], button[class*="logout"]') ||
                    await page.$$eval('button', btns => {
                      const b = btns.find(btn => btn.textContent.toLowerCase().includes('logout') || btn.textContent.toLowerCase().includes('sign out'));
                      return b ? b : null;
                    }).catch(() => null);

  const logoutBtnText = logoutBtn ? await page.evaluate(el => el ? el.textContent.trim() : null, logoutBtn) : null;

  if (logoutBtnText) {
    log('✅', 'Logout button found', logoutBtnText);
  } else {
    // Try to find in menu/drawer
    const allButtons = await page.$$eval('button', btns =>
      btns.map(b => b.textContent.trim()).filter(t => t.length < 30)
    ).catch(() => []);
    log('🔍', 'Buttons visible on dashboard', allButtons.slice(0,10).join(' | '));
    log('⚠️', 'Logout button not found directly', 'may be hidden in user menu');
  }

  await shot('08-dashboard-logout');

  // Check session state
  const sessionHasData = await page.evaluate(() => !!sessionStorage.getItem('user_data'));
  log('🔍', 'Session still has user_data', String(sessionHasData));

  // ─── TEST 9: CONFIG & RUNTIME VALIDATION ─────────────────────────────────
  console.log('\n── TEST 9: Config & Runtime Checks ──');

  const configCheck = await page.evaluate(async () => {
    const r = await fetch('/config.json');
    const cfg = await r.json();
    return {
      hasOcrRoutes: typeof cfg.ocrRoutes !== 'undefined',
      pdfTypeValue: cfg.pdfType,
      pdfTypeIsObject: typeof cfg.pdfType === 'object',
      keys: Object.keys(cfg)
    };
  });
  log('🔍', 'config.json keys', configCheck.keys.join(', '));
  if (!configCheck.hasOcrRoutes) {
    log('⚠️', 'config.json missing "ocrRoutes" key', 'authService.ocrRoutes will be undefined → getOCRRoute() throws');
  }
  log(configCheck.pdfTypeIsObject ? '✅' : '⚠️',
    `config.json pdfType is ${typeof configCheck.pdfTypeValue}: "${configCheck.pdfTypeValue}"`,
    configCheck.pdfTypeIsObject ? 'correct' : 'should be object — auth.service.ts:136 bug sets this.pdfType = full config anyway');

  // ─── TEST 10: FORM VALIDATION DETAIL — LOGIN ──────────────────────────────
  console.log('\n── TEST 10: Login Validation Detail ──');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 10000 });

  // Get the actual form structure
  const formDetails = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    return inputs.map(inp => ({
      type: inp.type,
      placeholder: inp.placeholder,
      required: inp.required,
      formControlName: inp.getAttribute('formcontrolname') || inp.getAttribute('ng-reflect-name'),
      hasNgModel: !!inp.closest('[ng-model]'),
      classes: inp.className,
    }));
  });
  log('🔍', 'Login form inputs', JSON.stringify(formDetails, null, 0));

  // Type valid-looking email, check if format validation fires
  const emailInput = await page.$('input[type="text"], input[type="email"]');
  if (emailInput) {
    await emailInput.type('bad-email-no-at');
    await emailInput.press('Tab');
    await page.waitForTimeout(500);

    const errorsAfterBadEmail = await page.$$eval('mat-error, .field-error, [class*="error-msg"]',
      els => els.map(e => e.textContent.trim()).filter(Boolean)
    ).catch(() => []);
    const inputClasses = await page.$eval('input[type="text"], input[type="email"]', el => el.className).catch(() => '');

    log(errorsAfterBadEmail.length > 0 ? '✅' : '⚠️',
      'Email format validation',
      errorsAfterBadEmail.length > 0
        ? `error shown: "${errorsAfterBadEmail[0]}"`
        : `no mat-error — ng-invalid: ${inputClasses.includes('ng-invalid')}`
    );

    // Try max-length or XSS input
    await emailInput.click({ clickCount: 3 });
    await emailInput.type('<script>alert(1)</script>');
    await page.waitForTimeout(300);
    const xssInField = await page.$eval('input[type="text"], input[type="email"]', el => el.value).catch(() => '');
    log('🔍', 'XSS probe in username field', `value stored: "${xssInField.substring(0,50)}"`);
  }

  // ─── TEST 11: CONSOLE ERROR SUMMARY ──────────────────────────────────────
  console.log('\n── TEST 11: Console Error Summary ──');
  if (consoleErrors.length > 0) {
    log('⚠️', `Total console errors during session: ${consoleErrors.length}`, '');
    const unique = [...new Set(consoleErrors)];
    unique.slice(0, 6).forEach(e => console.log('  ERR:', e.substring(0, 180)));
  } else {
    log('✅', 'No console errors during entire test session', '');
  }

  if (apiRequests.length > 0) {
    log('🔍', `API requests attempted (all failed — backend down): ${apiRequests.length}`, '');
    apiRequests.slice(0,8).forEach(r => console.log('  ', r));
  }

  await browser.close();
  console.log('\n[Done] Screenshots at:', SCREENSHOTS);

})().catch(async err => {
  console.error('\nFATAL:', err.message);
  if (page) await shot('fatal').catch(() => {});
  if (browser) await browser.close();
});
