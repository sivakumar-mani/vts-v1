const ExcelJS = require('exceljs');
const path = require('path');

async function generateReport() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'VTS Upgrade Report';
  workbook.created = new Date();

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } };
  const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const subHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
  const addedFill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
  const removedFill= { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEBEE' } };
  const changedFill= { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
  const fixedFill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3E5F5' } };
  const border = {
    top: { style: 'thin', color: { argb: 'FFB0BEC5' } },
    left: { style: 'thin', color: { argb: 'FFB0BEC5' } },
    bottom: { style: 'thin', color: { argb: 'FFB0BEC5' } },
    right: { style: 'thin', color: { argb: 'FFB0BEC5' } }
  };

  function styleHeader(row, fillColor) {
    row.eachCell(cell => {
      cell.fill = fillColor || headerFill;
      cell.font = headerFont;
      cell.border = border;
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
    row.height = 30;
  }

  function styleDataRow(row, fillObj) {
    row.eachCell(cell => {
      cell.fill = fillObj;
      cell.border = border;
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    row.height = 22;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 1 — SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  const s1 = workbook.addWorksheet('1. Summary');
  s1.columns = [
    { header: '', key: 'category', width: 35 },
    { header: '', key: 'value',    width: 65 },
  ];

  const summaryData = [
    ['PROJECT', 'VTS – Verification Tracking System'],
    ['UPGRADE', 'Angular 16  →  Angular 17'],
    ['DATE', '2026-06-12'],
    ['NODE REQUIRED', 'Node.js 18.13+ (upgraded to v22.22.3)'],
    ['TYPESCRIPT', '~4.x  →  ~5.4.2'],
    ['RXJS', '^6.x (with rxjs-compat)  →  ^7.8.0 (no compat layer)'],
    ['', ''],
    ['TOTAL PACKAGE CHANGES', '40+ packages updated / added / removed'],
    ['TYPESCRIPT FILES CHANGED', '6 files'],
    ['HTML TEMPLATE FILES CHANGED', '96+ files (@ symbol fix + scrollbar replacement)'],
    ['NEW FILES CREATED', '1 file (filter.pipe.ts)'],
    ['', ''],
    ['LEGEND', ''],
    ['🟡 CHANGED', 'Version updated to Angular 17 compatible version'],
    ['🟢 ADDED', 'New package added (not present in Angular 16)'],
    ['🔴 REMOVED', 'Package removed (not Ivy-compatible or deprecated)'],
    ['🟣 FIXED', 'Code fix required due to Angular 17 breaking change'],
  ];

  s1.addRow(['Category', 'Detail']);
  styleHeader(s1.getRow(1));
  summaryData.forEach(([cat, val]) => {
    const row = s1.addRow([cat, val]);
    const fill = cat.startsWith('🟡') ? changedFill
               : cat.startsWith('🟢') ? addedFill
               : cat.startsWith('🔴') ? removedFill
               : cat.startsWith('🟣') ? fixedFill
               : subHeaderFill;
    styleDataRow(row, fill);
    if (['PROJECT','UPGRADE','DATE','NODE REQUIRED','TYPESCRIPT','RXJS'].includes(cat)) {
      row.getCell(1).font = { bold: true };
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 2 — PACKAGE CHANGES
  // ══════════════════════════════════════════════════════════════════════════
  const s2 = workbook.addWorksheet('2. Package Changes');
  s2.columns = [
    { key: 'no',      width: 5  },
    { key: 'package', width: 45 },
    { key: 'old',     width: 20 },
    { key: 'new',     width: 20 },
    { key: 'type',    width: 12 },
    { key: 'reason',  width: 55 },
  ];
  s2.addRow(['#', 'Package Name', 'Old Version', 'New Version', 'Type', 'Reason / Notes']);
  styleHeader(s2.getRow(1));

  const packages = [
    // Angular Core
    ['@angular/animations',            '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/cdk',                   '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/common',                '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/core',                  '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/forms',                 '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/google-maps',           '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/localize',              '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/material',              '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/platform-browser',      '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/platform-browser-dynamic','^16.x','^17.3.0','🟡 CHANGED', 'Angular 17 core upgrade'],
    ['@angular/router',                '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 core upgrade'],
    // DevKit
    ['@angular-devkit/build-angular', '^16.x', '^17.3.0', '🟡 CHANGED', 'Build tool for Angular 17'],
    ['@angular-devkit/core',          '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 devkit'],
    ['@angular-devkit/schematics',    '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 devkit'],
    ['@angular/cli',                  '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 CLI'],
    ['@angular/compiler',             '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 compiler'],
    ['@angular/compiler-cli',         '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 compiler-cli'],
    ['@angular/language-service',     '^16.x', '^17.3.0', '🟡 CHANGED', 'Angular 17 language service'],
    // Zone.js
    ['zone.js',                       '~0.13.x','~0.14.3','🟡 CHANGED', 'Required by Angular 17'],
    // TypeScript
    ['typescript',                    '~4.9.x', '~5.4.2', '🟡 CHANGED', 'Angular 17 requires TypeScript 5.x'],
    // RxJS
    ['rxjs',                          '^6.x',   '^7.8.0', '🟡 CHANGED', 'Angular 17 requires RxJS 7; removed rxjs-compat'],
    // Kendo UI
    ['@progress/kendo-angular-buttons',  '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-common',   '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-dateinputs','^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-dialog',   '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-dropdowns','^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-excel-export','^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-grid',     '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-icons',    '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-inputs',   '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-intl',     '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-l10n',     '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-label',    '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-navigation','^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-pdf-export','^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-popup',    '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-treeview', '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-angular-utils',    '^12.x','^13.0.0','🟡 CHANGED','Kendo 13 supports Angular 17'],
    ['@progress/kendo-theme-default',    '^4.x',  '^6.4.0','🟡 CHANGED','Kendo theme for Angular 17'],
    ['@progress/kendo-angular-layout',   '(none)','^13.0.0','🟢 ADDED', 'New required Kendo peer dependency for Angular 17'],
    ['@progress/kendo-angular-progressbar','(none)','^13.0.0','🟢 ADDED','New required Kendo peer dependency for Angular 17'],
    // PrimeNG
    ['primeng',                          '^9.x',  '^17.18.0','🟡 CHANGED','PrimeNG 17 supports Angular 17'],
    ['primeicons',                       '^4.x',  '^7.0.0',  '🟡 CHANGED','PrimeIcons 7 for PrimeNG 17'],
    // Auth
    ['angular-oauth2-oidc',             '^12.x', '^17.0.0', '🟡 CHANGED','Angular 17 compatible auth library'],
    ['angular-oauth2-oidc-jwks',        '^12.x', '^17.0.0', '🟡 CHANGED','Angular 17 compatible auth library'],
    // Layout / Misc
    ['@ngbracket/ngx-layout',           '^12.x', '^17.0.0', '🟡 CHANGED','Angular 17 compatible flex layout'],
    ['ngx-spinner',                     '^12.x', '^17.0.0', '🟡 CHANGED','Angular 17 compatible spinner'],
    ['ngx-countdown',                   '^12.x', '^17.0.0', '🟡 CHANGED','API change: CountdownGlobalConfig → COUNTDOWN_CONFIG'],
    ['@swimlane/ngx-charts',            '^18.x', '^21.0.0', '🟡 CHANGED','Angular 17 compatible charts'],
    ['angular-calendar',                '^0.28.x','^0.30.0','🟡 CHANGED','Angular 17 compatible calendar'],
    ['ngx-image-compress',              '^12.x', '^15.1.6', '🟡 CHANGED','Angular 17 compatible (no v16 exists)'],
    ['ngx-scanner-qrcode',              '^1.3.x','1.8.1',   '🟡 CHANGED','Module renamed to standalone component in 1.8.x'],
    ['@danielmoncada/angular-datetime-picker','(varies)','^17.0.0','🟡 CHANGED','Angular 17 compatible datetime picker'],
    // Removed
    ['ngx-perfect-scrollbar',           '^10.0.1','REMOVED', '🔴 REMOVED','Not Ivy-compatible; abandoned. Replaced with <div style="overflow:auto">'],
    ['ng2-search-filter',               '^0.5.1', 'REMOVED', '🔴 REMOVED','Not Ivy-compatible. Replaced with custom FilterPipe'],
    // Test
    ['jasmine-core',                    '~4.x',  '~5.1.0',  '🟡 CHANGED','Angular 17 test framework update'],
    ['@types/jasmine',                  '~4.x',  '~5.1.0',  '🟡 CHANGED','Angular 17 test types update'],
  ];

  packages.forEach((pkg, i) => {
    const row = s2.addRow([i + 1, ...pkg]);
    const type = pkg[3];
    const fill = type === '🟡 CHANGED' ? changedFill
               : type === '🟢 ADDED'   ? addedFill
               : type === '🔴 REMOVED' ? removedFill
               : subHeaderFill;
    styleDataRow(row, fill);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 3 — TYPESCRIPT / MODULE FILES
  // ══════════════════════════════════════════════════════════════════════════
  const s3 = workbook.addWorksheet('3. TS File Changes');
  s3.columns = [
    { key: 'no',       width: 5  },
    { key: 'file',     width: 55 },
    { key: 'type',     width: 14 },
    { key: 'change',   width: 70 },
    { key: 'reason',   width: 55 },
  ];
  s3.addRow(['#', 'File Path', 'Change Type', 'What Changed', 'Why (Breaking Change / Fix)']);
  styleHeader(s3.getRow(1));

  const tsFiles = [
    [
      'package.json',
      '🟡 CHANGED',
      '40+ dependency versions updated. Added kendo-angular-layout, kendo-angular-progressbar. Removed ngx-perfect-scrollbar & ng2-search-filter usage.',
      'Angular 17 requires updated compatible versions of all ecosystem packages'
    ],
    [
      'tsconfig.json',
      '🟡 CHANGED',
      'lib array changed from ["es2020","dom"] to ["ES2022","dom"]',
      'Angular 17 / TypeScript 5.x targets ES2022 by default'
    ],
    [
      'src/app/app.module.ts',
      '🟡 CHANGED',
      '1) Removed PerfectScrollbarModule import & provider\n2) CountdownGlobalConfig → COUNTDOWN_CONFIG (API renamed in ngx-countdown v17)\n3) NgxScannerQrcodeModule → NgxScannerQrcodeComponent (module became standalone component in v1.8.x)',
      '1) ngx-perfect-scrollbar not Ivy-compatible\n2) ngx-countdown v17 renamed the config token\n3) ngx-scanner-qrcode v1.8.x is a standalone component'
    ],
    [
      'src/app/common-methods/modules/shared.module.ts',
      '🟡 CHANGED',
      '1) Removed PerfectScrollbarModule from imports/exports\n2) Removed Ng2SearchPipeModule from imports\n3) Added FilterPipe to declarations and exports',
      '1) ngx-perfect-scrollbar removed\n2) ng2-search-filter not Ivy-compatible\n3) Custom FilterPipe created as replacement'
    ],
    [
      'src/app/common-methods/modules/material.module.ts',
      '🟡 CHANGED',
      'Removed Ng2SearchPipeModule import and from MATERIAL_MODULES array',
      'ng2-search-filter is not compatible with Angular 17 Ivy compiler'
    ],
    [
      'src/app/common-methods/pipes/filter.pipe.ts',
      '🟢 NEW FILE',
      'Created custom FilterPipe to replace ng2-search-filter.\nFilters array items by matching searchText against all property values.',
      'ng2-search-filter was removed; a custom pipe was needed to maintain search functionality'
    ],
    [
      'src/app/common-methods/components/invitation-creation/invitation-creation.component.ts',
      '🟣 FIXED',
      'routePath property moved from class field initializer to ngOnInit().\nBefore: routePath = this.common.subCheckFlag !== true ? ... : ...\nAfter: routePath: string = \'\'; and set in ngOnInit()',
      'TypeScript error TS2729: Property \'common\' used before its own initialization. Angular 17 / TS5 is stricter about class field initialization order.'
    ],
    [
      'src/app/invoice/preview-invoice/preview-invoice.component.ts',
      '🟣 FIXED',
      'Fix 1: Moved initForGroupForAutoComplete() BEFORE getInvoiceClient() in ngOnInit()\nFix 2: siteId and groupId initialized as disabled controls. Added .enable()/.disable() calls in siteName(). Removed [disabled] binding from template.',
      'Fix 1: NG01052 – formGroup expects a FormGroup instance (template bound before form was created)\nFix 2: Angular 17 warns that [disabled] on reactive form controls should use .enable()/.disable() instead'
    ],
  ];

  tsFiles.forEach((item, i) => {
    const row = s3.addRow([i + 1, ...item]);
    const type = item[1];
    const fill = type === '🟡 CHANGED' ? changedFill
               : type === '🟢 NEW FILE' ? addedFill
               : type === '🔴 REMOVED' ? removedFill
               : fixedFill;
    styleDataRow(row, fill);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 4 — HTML TEMPLATE CHANGES
  // ══════════════════════════════════════════════════════════════════════════
  const s4 = workbook.addWorksheet('4. HTML Template Changes');
  s4.columns = [
    { key: 'no',      width: 5  },
    { key: 'scope',   width: 35 },
    { key: 'count',   width: 12 },
    { key: 'change',  width: 55 },
    { key: 'before',  width: 35 },
    { key: 'after',   width: 35 },
    { key: 'reason',  width: 50 },
  ];
  s4.addRow(['#', 'Scope / Files Affected', 'File Count', 'Change Description', 'Before (Example)', 'After (Example)', 'Why']);
  styleHeader(s4.getRow(1));

  const htmlChanges = [
    [
      'All HTML templates with email addresses',
      '66+ files',
      'Replaced @ symbol in email addresses with HTML entity &#64;',
      'support@kryasolutions.com',
      'support&#64;kryasolutions.com',
      'Angular 17 introduced new @ block syntax (@if, @for, @switch). Any bare @ in templates is parsed as a control-flow block, causing NG5002 "Incomplete block" compile errors.'
    ],
    [
      'generate-pdf.component.html',
      '1 file',
      'Fixed double @ used as Kendo pager binding attribute',
      '[@@Paging]',
      '[&#64;&#64;Paging]',
      'Same reason — Angular 17 @ syntax parser treats @@ as block syntax'
    ],
    [
      'HTML templates with "we @" text pattern',
      '~30 files',
      'Fixed space-prefixed @ in text content',
      'we @ kryasolutions',
      'we &#64; kryasolutions',
      'Same reason — Angular 17 @ syntax'
    ],
    [
      'HTML templates using <perfect-scrollbar>',
      '~30 files',
      'Replaced <perfect-scrollbar> element with <div style="overflow:auto">',
      '<perfect-scrollbar [config]="config">\n  ...\n</perfect-scrollbar>',
      '<div style="overflow:auto">\n  ...\n</div>',
      'ngx-perfect-scrollbar is not Ivy-compatible and is abandoned. Removed the package; replaced the component with a plain scrollable div.'
    ],
    [
      'preview-invoice.component.html',
      '1 file',
      'Removed [disabled] attribute binding on two <mat-select> elements',
      '<mat-select [formControl]="siteId"\n  [disabled]="sitevalue?.length===0">',
      '<mat-select [formControl]="siteId">',
      'Angular 17 warns: do not use [disabled] with reactive form controls. Disable/enable state is now managed via FormControl.disable() and .enable() in the component.'
    ],
  ];

  htmlChanges.forEach((item, i) => {
    const row = s4.addRow([i + 1, ...item]);
    styleDataRow(row, changedFill);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 5 — ERRORS FIXED
  // ══════════════════════════════════════════════════════════════════════════
  const s5 = workbook.addWorksheet('5. Errors Fixed');
  s5.columns = [
    { key: 'no',      width: 5  },
    { key: 'error',   width: 35 },
    { key: 'location',width: 50 },
    { key: 'cause',   width: 55 },
    { key: 'fix',     width: 60 },
  ];
  s5.addRow(['#', 'Error Code / Message', 'File / Location', 'Root Cause', 'Fix Applied']);
  styleHeader(s5.getRow(1));

  const errors = [
    [
      'NG5002: Incomplete block',
      '66+ HTML template files',
      'Angular 17 treats @ as control-flow block syntax (@if, @for, @switch). Email addresses and text with @ were parsed as broken blocks.',
      'Replaced all @ symbols in email addresses and inline text with HTML entity &#64; across 66+ HTML files using PowerShell script.'
    ],
    [
      'Module not found: ngx-perfect-scrollbar (not Ivy-compatible)',
      'app.module.ts, shared.module.ts, 30+ HTML files',
      'ngx-perfect-scrollbar library uses ViewEngine and is not compatible with Angular 17 Ivy compiler.',
      'Removed PerfectScrollbarModule from all imports. Replaced all <perfect-scrollbar> tags with <div style="overflow:auto"> in 30+ templates.'
    ],
    [
      'Module not found: Ng2SearchPipeModule (not Ivy-compatible)',
      'shared.module.ts, material.module.ts',
      'ng2-search-filter library is not Ivy-compatible with Angular 17.',
      'Removed Ng2SearchPipeModule. Created a custom FilterPipe (filter.pipe.ts) as a drop-in replacement.'
    ],
    [
      'CountdownGlobalConfig not exported (ngx-countdown v17)',
      'app.module.ts',
      'In ngx-countdown v17, the config token was renamed from CountdownGlobalConfig to COUNTDOWN_CONFIG.',
      'Changed import and provider to use COUNTDOWN_CONFIG instead of CountdownGlobalConfig.'
    ],
    [
      'NgxScannerQrcodeModule not found (v1.8.x)',
      'app.module.ts',
      'In ngx-scanner-qrcode v1.8.x, the NgxScannerQrcodeModule was replaced by a standalone NgxScannerQrcodeComponent.',
      'Changed import from NgxScannerQrcodeModule to NgxScannerQrcodeComponent.'
    ],
    [
      'TS2729: Property \'common\' used before its initialization',
      'invitation-creation.component.ts',
      'TypeScript 5 / Angular 17 strict field initialization: class field tried to use injected service (this.common) before Angular had injected it.',
      'Moved routePath initialization from class field declaration to ngOnInit() body.'
    ],
    [
      'NG01052: formGroup expects a FormGroup instance',
      'preview-invoice.component.ts (runtime)',
      'In ngOnInit(), getInvoiceClient() was called before initForGroupForAutoComplete(). The HTTP call triggered change detection before invoiceClientListForm was created.',
      'Reordered ngOnInit(): call initForGroupForAutoComplete() before getInvoiceClient().'
    ],
    [
      '@progress/kendo-angular-layout not found',
      'package.json (peer dependency)',
      'Kendo UI v13 requires @progress/kendo-angular-layout as a peer dependency, which was not in the original package.json.',
      'Added "@progress/kendo-angular-layout": "^13.0.0" to package.json.'
    ],
    [
      '@progress/kendo-angular-progressbar not found',
      'package.json (peer dependency)',
      'Kendo UI v13 requires @progress/kendo-angular-progressbar as a peer dependency.',
      'Added "@progress/kendo-angular-progressbar": "^13.0.0" to package.json.'
    ],
    [
      'Node.js version too old (v12 / v16 in PATH)',
      'Development environment',
      'Angular 17 CLI requires Node.js 18.13 minimum. Old Node.js 12 from D:\\node12\\ was in PATH.',
      'Installed Node.js v22.22.3 via NVM and refreshed PATH environment variable.'
    ],
    [
      'npm ERR! kendo-licensing postinstall failure',
      'npm install',
      'Kendo license activation script failed during npm install.',
      'Used npm install --legacy-peer-deps --ignore-scripts to skip the postinstall script.'
    ],
    [
      '[disabled] attribute warning on reactive form',
      'preview-invoice.component.html (runtime warning)',
      'Angular 17 warns against using [disabled] attribute binding on reactive form controls.',
      'Initialized siteId/groupId controls as disabled. Added .enable()/.disable() calls in siteName(). Removed [disabled] from template.'
    ],
  ];

  errors.forEach((item, i) => {
    const row = s5.addRow([i + 1, ...item]);
    styleDataRow(row, fixedFill);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 6 — INFRASTRUCTURE CHANGES
  // ══════════════════════════════════════════════════════════════════════════
  const s6 = workbook.addWorksheet('6. Infrastructure');
  s6.columns = [
    { key: 'no',     width: 5  },
    { key: 'item',   width: 30 },
    { key: 'before', width: 30 },
    { key: 'after',  width: 30 },
    { key: 'notes',  width: 60 },
  ];
  s6.addRow(['#', 'Item', 'Before', 'After', 'Notes']);
  styleHeader(s6.getRow(1));

  const infra = [
    ['Node.js',         'v12.22.12 / v16.x',  'v22.22.3 (LTS)',    'Angular 17 minimum is Node 18.13+. Used NVM to manage multiple Node.js versions.'],
    ['Angular CLI',     '@angular/cli ^16.x',  '@angular/cli ^17.3.0', 'Required for ng build / ng serve with Angular 17'],
    ['TypeScript',      '~4.9.x',              '~5.4.2',            'Angular 17 requires TypeScript 5.x. Uses newer strict checks.'],
    ['RxJS',            '^6.x + rxjs-compat',  '^7.8.0 (no compat)','rxjs-compat shim removed. Code must use rxjs 7 imports directly.'],
    ['Build heap',      '--max_old_space_size=8192', '--max_old_space_size=8192 (kept)', 'Retained due to large project size. Required for successful build.'],
    ['Build time',      '~90 sec (est.)',       '~140 sec',          'Ivy full compilation; initial bundle ~36.85 MB'],
    ['Kendo UI',        'v12 (Angular 12)',     'v13 (Angular 17)',  'Major version bump. Two new peer deps added: kendo-angular-layout, kendo-angular-progressbar'],
    ['PrimeNG',         'v9',                   'v17.18.0',          'Major version jump from 9 to 17 to match Angular 17'],
  ];

  infra.forEach((item, i) => {
    const row = s6.addRow([i + 1, ...item]);
    styleDataRow(row, subHeaderFill);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SAVE
  // ══════════════════════════════════════════════════════════════════════════
  const outputPath = path.join(__dirname, 'Angular16_to_17_Upgrade_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log('✅ Report saved to: ' + outputPath);
}

generateReport().catch(err => {
  console.error('❌ Error generating report:', err.message);
  process.exit(1);
});
