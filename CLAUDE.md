# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (Vite-based in Angular 21)
npm start

# Production build
npm run build:prod

# Development build
npm run build

# Unit tests (Karma/Jasmine — watch mode)
npm test

# Run tests once (no watch)
npx karma start src/karma.conf.js --single-run

# Lint (TSLint)
npm run lint

# E2E tests (Protractor)
npm run e2e
```

> All build/serve commands allocate 8GB heap (`--max_old_space_size=8192`) due to project size. Do not remove this flag.

To run a single spec file, add a `fit()` or `fdescribe()` inside the spec, or configure the `files` pattern in `src/karma.conf.js` temporarily.

## Architecture Overview

**VTS (Verification Tracking System)** is an Angular 21.2.15 enterprise application for candidate background verification workflows: screening, case creation, verification, quality-check, invoicing, and reporting.

### Module Structure

The app uses lazy-loaded feature modules under a shared `/dashboard` shell:

| Route | Module | Purpose |
|---|---|---|
| `/master` | MasterModule | Country/State/City/User/Vendor master data + approval workflows (~60 components) |
| `/screening` | ScreeningModule | Candidate file/app submissions with dynamic form composition (~100+ components) |
| `/client` | ClientEntryModule | Client master, billing rules, package creation, fee approvals |
| `/case` | CaseModule | Case creation, LOA approval, scope bypass, history (7 components) |
| `/verification` | VerificationModule | Verification workflows, PDF generation, re-opens, additional fees (~35 components) |
| `/qc` | QualityCheckModule | QC list, details, approval workflows (4 components) |
| `/reports` | ReportsModule | Case/file tracker, statistics, billing reports |
| `/invoice` | InvoiceModule | Invoice generation, preview, manual registration |
| `/automation` | AutomationModule | Automation trigger management |

Authentication routes (`/login`, `/ssologin`, `/auth-callback`, `/deptChoose`) are outside the dashboard shell. External callback routes (`/AddressVerification/:urlid`, `/DigiLockerVerification/:urlid`, `/DirectAppCandidateInsuff/:urlid`) are also at root level for unauthenticated access.

**All feature modules follow the same import pattern:**
```typescript
imports: [CommonModule, [Feature]RoutingModule, SharedModule, /* optional specifics */]
```

### Shared Module Pattern

`SharedModule` (`src/app/common-methods/modules/shared.module.ts`) is imported by every feature module. It re-exports `MaterialModule` — a barrel that aggregates all Angular Material, Kendo UI, and PrimeNG imports in one place (`src/app/common-methods/modules/material.module.ts`). Add new UI library modules to `MaterialModule`, not to individual feature modules.

### Route Guard

`CanactivateGuard` reads `user_roles` from sessionStorage. Each role entry exposes flags: `addFlag`, `editFlag`, `deleteFlag`, `viewFlag`, `fullAccessFlag`, `approveFlag`. Access is granted only if at least one flag is true for the matched route. On deny, opens `CommonAlertsComponent` dialog and redirects to `/login` if session is missing.

### State Management

No NgRx. State flows through:
- **SessionStorage**: `user_data`, `user_roles`, `languageId` — set on login, persists across reloads, cleared on logout.
- **AuthService** (`src/app/common-methods/services/auth.service.ts`): Central auth state, API URL resolution, PDF type mapping, and config loading via `APP_INITIALIZER`. Properties like `clientId`, `vendorId`, `packageId`, `addOrEdit` are used as a cross-component data bus — features write to these before navigating to a sub-page that reads them.
- **SharedService** (`src/app/common-methods/services/shared.service.ts`): Cross-component communication via RxJS Subjects (`changeEmittedLoading$` for global spinner, `chengesecDrawer` for drawer toggle, `changesName` for name updates).
- **CommonService** (`src/app/common-methods/services/common.service.ts`): Shared utilities, date helpers (`maxDob`, `maxDate`), Excel/report styling, feature-count flags (`insuffCountFlag`, `qcCountFlag`), and status constants (`COMPLETED_STATUS`, `RECORD_FOUND_DISCREPANCY`).
- **Service properties**: Transient in-memory state held directly on feature services.

### HTTP & API Integration

**Interceptor** (`src/app/interceptor.ts`) — uses `Injector.get()` instead of constructor injection to avoid circular dependency with `AuthService`:
- Attaches `Authorization: Bearer <token>` to all requests.
- Routes requests to the correct base URL:
  - Relative URLs → `config.json` `apiUrl`
  - `Invoice/` prefix → `config.json` `invoiceapiUrl`
  - Document requests → `config.json` `documentUrl` (also sets `responseType: arraybuffer`)
  - Absolute `http/https` URLs → pass through
- Emits `SharedService.emitChangeLoading()` on every request start/end (drives global spinner).
- 401 → clears sessionStorage + navigates to `/login`. 403 session-override → alert + redirect to `/`.

**Runtime config** is loaded from `src/config.json` (not bundled — edit it in the output `dist/` folder for environment-specific deployments):
```json
{
  "apiUrl": "http://localhost:62414/api/",
  "invoiceapiUrl": "http://localhost:5003/api/",
  "expressUrl": "http://localhost:62414",
  "documentUrl": "http://localhost:62414/VtsDocument",
  "redirectUri": "http://localhost:4200/auth-callback"
}
```
`AuthService.load()` fetches this file at bootstrap via `APP_INITIALIZER` before the app renders.

### Authentication

OAuth2/OIDC via `angular-oauth2-oidc`. SSO flow: `/ssologin` → `/auth-callback`. Silent token refresh uses `src/silent-refresh.html`. `EncryptDecryptService` (crypto-js AES) encrypts sensitive values where needed. India DigiLocker integration uses a separate PKCE OIDC flow via `DigiLockerService` / `DigiLockerAuthService`.

Session idle timeout (30 min) is managed by `BnNgIdleService` in `AppComponent`. `TabPreventionService` blocks multiple simultaneous tabs.

### Dynamic Forms (Screening Module)

`DynamicControlService` generates reactive form controls at runtime. The `screening/DynamicComponents/` directory contains ~60 individual form-section components (Employment, Education, PAN, Drug Test, Address, License, Passport, UAN, etc.) composed into screening workflows based on the selected package.

### Key UI Libraries

- **Angular Material 21.2.14**: Dialogs (`MatDialog`), form controls, date picker. Common dialogs registered as entry components: `CommonDialogComponent`, `CommonAlertsComponent`.
- **Kendo UI (Progress) 24**: Grid, dropdowns, date inputs, Excel/PDF export — used heavily in lists and reports.
- **PrimeNG 17**: Calendar, Toast notifications, radio buttons, tooltip.
- **@ngbracket/ngx-layout**: Flex Layout fork for responsive layouts (replaces deprecated `@angular/flex-layout`).
- **ngx-spinner**: Global loading spinner toggled via `SharedService`.
- **@angular/google-maps**: Google Maps integration.
- **@aspnet/signalr**: Real-time notifications.
- **OWL DateTime Picker** (`@danielmoncada/angular-datetime-picker`): Used alongside Material DatePicker on some screens — both are active in the codebase.

### Excel Export

Two mechanisms coexist: Kendo Grid's native export (built into grid components) and manual styled reports using `ExcelJS` + `xlsx-js-style`. Styling utilities live in `CommonService`.

### Build Budgets

Production build enforces: initial bundle ≤ 15MB (warning) / 25MB (error), component styles ≤ 6KB. If a bundle exceeds limits, check for large Kendo/PrimeNG barrel imports and use specific sub-imports.

### Spec Files

`angular.json` schematics disable spec generation by default for components, classes, and services. Write tests manually when needed.
