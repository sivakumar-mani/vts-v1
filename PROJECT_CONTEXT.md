# VTS — Project Context Reference

## Application Overview

**VTS (Verification Tracking System)** is an Angular 13 enterprise application used internally by staff and vendors to manage the end-to-end lifecycle of candidate background verification. The system covers screening, case creation, multi-type verification, quality checking, invoicing, and reporting.

- **Angular**: 13.4.0 (upgraded from v7; README is outdated and still says 7.3.9)
- **TypeScript**: 4.6.4 — `strictTemplates: false`, no `noImplicitAny` or `strictNullChecks`
- **Build target**: ES2020
- **Build requirement**: 8GB heap (`--max_old_space_size=8192`) — do not remove from npm scripts
- **Runtime config**: `src/config.json` (not bundled; edited in `dist/` per environment)

---

## Module Hierarchy

```
AppModule
├── AppRoutingModule          (root routes)
├── SharedModule              (common-methods/modules/shared.module.ts)
│   └── MaterialModule        (common-methods/modules/material.module.ts)
│
├── LoginModule               (app/login/)            — eager
│
└── DashboardComponent shell  (lazy-loaded children, all guarded)
    ├── MasterModule          (route: /master)
    ├── ScreeningModule       (route: /screening)
    ├── ClientEntryModule     (route: /client)
    ├── CaseModule            (route: /case)
    ├── VerificationModule    (route: /verification)
    ├── QualityCheckModule    (route: /qc)
    ├── ReportsModule         (route: /reports)
    ├── InvoiceModule         (route: /invoice)
    └── AutomationModule      (route: /automation)
```

All feature modules import `SharedModule` to access common components, pipes, directives, and Material/Kendo/PrimeNG.

---

## Routing Structure

### Root-level routes (unauthenticated / public)

| Route | Component | Notes |
|---|---|---|
| `` | `LandingComponent` | Default entry |
| `login` | `LoginComponent` | Username/password login |
| `ssologin` | `SsologinComponent` | SSO entry point |
| `auth-callback` | `AuthCallbackComponent` | OAuth2 OIDC redirect handler |
| `deptChoose` | `DeptChooseComponent` | Post-login department selection |
| `pagemaintance` | `UndermaintanceComponent` | Maintenance mode page |
| `privacy` | `PrivacyPolicyComponent` | |
| `AddressVerification/:urlid` | External address verification | No auth required |
| `DigiLockerVerification/:urlid` | DigiLocker callback | No auth required |
| `DirectAppCandidateInsuff/:urlid` | Candidate self-insufficiency | No auth required |
| `canidateregistraion` | Candidate self-registration | Public |
| `urlexpired` | `UrlExpiredComponent` | |
| `**` | `PageNotFoundComponent` | 404 catch-all |

### Dashboard shell child routes (all protected by `CanactivateGuard`)

| Child Route | Target |
|---|---|
| `home` | Dashboard home |
| `departmentTeam` | Team view |
| `notification` | Notifications |
| `globalSearch` / `advanceSearch` | Search features |
| `master` | → lazy `MasterModule` |
| `screening` | → lazy `ScreeningModule` |
| `client` | → lazy `ClientEntryModule` |
| `case` | → lazy `CaseModule` |
| `verification` | → lazy `VerificationModule` |
| `qc` | → lazy `QualityCheckModule` |
| `reports` | → lazy `ReportsModule` |
| `invoice` | → lazy `InvoiceModule` |
| `automation` | → lazy `AutomationModule` |
| `vtsdashboard` | VTS statistics dashboard |

---

## Main Features

### Master Module (`/master`)
- Country, State, City, User, and Vendor master data management
- Approval workflows for master data changes

### Screening Module (`/screening`)
- Candidate file creation and application submissions
- **Dynamic form system**: `DynamicControlService` generates reactive form fields at runtime
- Individual form-section components under `screening/DynamicComponents/` (Employment, Education, PAN, Drug Test, Address, License, Passport, UAN, etc.) composed into screening workflows

### Client Entry Module (`/client`)
- Client master data management
- Billing rules and package creation
- Fee approval workflows

### Case Module (`/case`)
- Case creation, history, and status tracking
- Links candidates to verification packages

### Verification Module (`/verification`)
- Multi-type verification workflows
- PDF report generation
- Re-open flows and additional fee management

### Quality Check Module (`/qc`)
- QC list and detail views
- Approval/rejection workflows

### Reports Module (`/reports`)
- Case and file tracker reports
- Statistics dashboards (ngx-charts)
- Billing reports with Excel export (exceljs, xlsx-js-style)

### Invoice Module (`/invoice`)
- Invoice generation and preview
- Manual invoice registration
- Routes to a separate invoice API backend

### Automation Module (`/automation`)
- Trigger-based automation management

### Additional cross-cutting features
- **DigiLocker integration**: India's national identity document platform; full PKCE OAuth2 flow (`services/digiLocker/`)
- **Real-time notifications**: SignalR (`@aspnet/signalr`) via `NotificationService`
- **QR code scanning**: `ngx-scanner-qrcode` with WASM assets
- **Webcam / image capture**: `ngx-webcam`, `ngx-image-compress`, `ngx-image-cropper`
- **Signature capture**: `@ng-plus/signature-pad`
- **Google Maps**: `@agm/core` for address verification
- **Calendar views**: `fullcalendar` 3.x + `angular-calendar`

---

## API Integrations

### Backend endpoints (configured in `src/config.json`)

```json
{
  "apiUrl": "http://localhost:62414/api/",
  "invoiceapiUrl": "http://localhost:5003/api/",
  "expressUrl": "http://localhost:62414",
  "documentUrl": "...",
  "redirectUri": "http://localhost:4200/auth-callback"
}
```

`config.json` is not bundled — it is copied to `dist/` and edited directly per deployment environment.

### URL routing logic (`AuthService.getApiUrl()`)

| Condition | Resolves to |
|---|---|
| Starts with `/` | `expressUrl` + path (Express proxy) |
| Starts with `Invoice/` | `invoiceapiUrl` + path |
| Starts with `http` or `documentUrl` | Passed through unchanged |
| Everything else | `apiUrl` + path |

### Document downloads
The interceptor detects document requests and sets `responseType: 'arraybuffer'` automatically, so callers do not need to set this manually.

---

## Authentication Flow

### Standard login
1. User submits credentials on `/login`
2. `AuthService` posts to API, receives `auth_token` and user data
3. `user_data` and `user_roles` are stored in `sessionStorage`
4. User is redirected to `/deptChoose` (if multiple departments) then to `/home`

### SSO / OAuth2 OIDC login
1. User lands on `/ssologin` → redirected to identity provider
2. Provider redirects back to `/auth-callback`
3. `angular-oauth2-oidc` (`OAuthModule`) processes the token via `AuthCallbackComponent`
4. Silent token refresh uses `src/silent-refresh.html`

### Session management
- `APP_INITIALIZER` calls `AuthService.load()` at boot to load `config.json` and restore session state
- `BnNgIdleService` handles idle session timeout
- All protected routes pass through `CanactivateGuard`
- `Interceptor` handles 401 (redirect to login) and 403 "Session overridden" (alert + clear session)

---

## Guards & Interceptors

### `CanactivateGuard` (`common-methods/guards/canactivate.guard.ts`)
- Reads `user_data` from sessionStorage; redirects to `/login` if absent or missing `auth_token`
- Reads `user_roles[]` from sessionStorage; finds entry matching the current URL
- Grants access only if any of `addFlag | editFlag | deleteFlag | viewFlag` is truthy for that route
- On unauthorized access, opens `CommonAlertsComponent` dialog with a permission message
- Applied to all dashboard child routes

### `Interceptor` (`src/app/interceptor.ts`)
- Rewrites relative API paths to full URLs via `authService.getApiUrl()`
- Appends `Authorization: Bearer <token>` from sessionStorage on every outgoing request
- Emits loading state via `SharedService.emitChangeLoading()` (drives the global ngx-spinner)
- Document requests: drops `Content-Type`, sets `responseType: 'arraybuffer'`, adds CORS headers
- Error handling: 401 → clear session + navigate to `/login`; 403 "Session overridden" → alert + clear

---

## Shared Utilities

### SharedModule (`common-methods/modules/shared.module.ts`)
Imported by every feature module. Exports:

**Pipes**
- `SearchPipe` — client-side text search across lists
- `SortPipe` — sortable columns
- `MaskPipe` / `MailMask` — data masking for sensitive fields
- `HighlightPipe` — search term highlighting

**Directives**
- `NumberOnlyDirective` — restricts input to numeric characters
- `CopyDirective` — clipboard copy
- `DragdropDirective` — drag-and-drop file upload
- `ScrollToErrorDirective` — auto-scrolls to first invalid form control
- `CapsLockDirective` — detects Caps Lock state

**Reusable components**
- `CommonDialogComponent` — generic confirmation/action dialog (registered as `entryComponent` in AppModule)
- `CommonAlertsComponent` — generic alert dialog
- `LocationComponent` — Google Maps address picker
- `CaptureMainComponent`, `ImageComponent`, `VideoComponent` — camera/media capture
- `SignatureComponent` — signature pad
- `PhoneFieldComponent`, `PhoneMultiComponent` — phone number inputs
- `AddAddressDetailComponent` — address form

**Services**
- `AuthService` — central auth state, config access, URL resolution
- `SharedService` — RxJS event bus: `changeEmitted$`, `changeEmittedLoading$`, `changesName`, `chengesecDrawer`
- `CommonService` — shared utility methods; holds `screenName` (set by guard)
- `EncryptDecryptService` — crypto-js AES encryption/decryption
- `FileDownloadService` — file download helpers
- `DynamicControlService` — runtime reactive form generation for Screening module
- `NotificationService` — SignalR real-time notifications
- `OAuthService` — wraps `angular-oauth2-oidc`
- `SearchCriteriaService` — persists search state across navigation
- `WindowRefService` — Angular-safe `window` reference

### MaterialModule (`common-methods/modules/material.module.ts`)
Barrel module — aggregates all Angular Material, PrimeNG, and Kendo module imports/exports in one place. Imported only by SharedModule to avoid duplication.

---

## Coding Patterns

### State management
No NgRx. State flows through three channels:
1. **SessionStorage** — `user_data`, `user_roles`, `languageId` (set on login, read everywhere)
2. **`AuthService` properties** — transient session-scoped state (`clientId`, `vendorId`, `packageId`, `addOrEdit`, etc.); used as a cross-component data bus via direct property access
3. **`SharedService` Subjects** — event-driven cross-component communication for loading state, drawer toggling, name changes

### HTTP calls
- All HTTP calls are made through Angular's `HttpClient` inside feature services
- Service methods return `Observable<any>` (rarely typed); `.subscribe()` is called in components
- No centralized error handling per feature — errors are handled inline in component `.subscribe()` error callbacks
- The interceptor handles global concerns (token injection, loading state, session expiry)

### Forms
- **Reactive Forms** (`FormBuilder`, `FormGroup`, `FormArray`) used throughout
- `DynamicControlService` generates form controls at runtime for Screening module sections
- Template-driven forms are used in a few older components

### Component communication
- Parent → child: `@Input()` bindings
- Child → parent: `@Output()` / `EventEmitter`
- Sibling / cross-module: via `SharedService` Subjects or `AuthService` properties
- Dialogs: `MatDialog.open()` with data passed via `MAT_DIALOG_DATA`; result via `afterClosed()`

### Dialogs
- `CommonDialogComponent` and `CommonAlertsComponent` are used project-wide for confirmations and alerts
- Opened via `MatDialog.open(Component, { width, data })` pattern

### Loading spinner
- Global spinner is `ngx-spinner` controlled via `SharedService.emitChangeLoading(true/false)`
- The interceptor emits these automatically on every HTTP request
- Individual components can also emit directly for local loading states

### Data grids
- **Kendo Grid** is the primary data grid (sorting, filtering, pagination, Excel/PDF export built-in)
- **PrimeNG Table** used in some older screens
- Excel export uses both Kendo's built-in export and manual `exceljs`/`xlsx-js-style` for styled reports

### Encryption
- Sensitive data (passwords, tokens in some flows) is encrypted with `EncryptDecryptService` (crypto-js AES) before storage or transmission

### Date handling
- `moment.js` for date manipulation
- Angular Material DatePicker and OWL DateTime Picker both used; locale set to `en-US` in AppModule
- `DatePipe` provided in AppModule for template use

### Build & deployment
- Feature modules are lazy-loaded (separate JS chunks per module)
- Production build: `optimization: true`, `buildOptimizer: true`, `outputHashing: all`, no source maps
- Bundle budget: initial ≤ 15MB warning / 25MB error; component styles ≤ 6KB
- No spec file auto-generation (disabled in angular.json schematics); tests written manually
