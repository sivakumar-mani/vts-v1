# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server
npm start

# Production build
npm run build:prod

# Development build
npm run build

# Unit tests (Karma/Jasmine)
npm test

# Lint (TSLint)
npm run lint

# E2E tests (Protractor)
npm run e2e
```

> All build/serve commands allocate 8GB heap (`--max_old_space_size=8192`) due to project size. Do not remove this flag.

## Architecture Overview

**VTS (Verification Tracking System)** is an Angular 12 enterprise application for candidate background verification workflows: screening, case creation, verification, quality-check, invoicing, and reporting.

### Module Structure

The app uses lazy-loaded feature modules under a shared `/dashboard` shell:

| Route | Module | Purpose |
|---|---|---|
| `/master` | MasterModule | Country/State/City/User/Vendor master data + approval workflows |
| `/screening` | ScreeningModule | Candidate file and application submissions with dynamic components |
| `/client` | ClientEntryModule | Client master, billing rules, package creation, fee approvals |
| `/case` | CaseModule | Case creation, history, and status tracking |
| `/verification` | VerificationModule | Verification workflows, PDF generation, re-opens, additional fees |
| `/qc` | QualityCheckModule | QC list, details, approval workflows |
| `/reports` | ReportsModule | Case/file tracker, statistics, billing reports |
| `/invoice` | InvoiceModule | Invoice generation, preview, manual registration |
| `/automation` | AutomationModule | Automation trigger management |

Authentication routes (`/login`, `/ssologin`, `/auth-callback`, `/deptChoose`) are outside the dashboard shell. External callback routes (`/AddressVerification/:urlid`, `/DigiLockerVerification/:urlid`, `/DirectAppCandidateInsuff/:urlid`) are also at root level for unauthenticated access.

### Route Guard

`CanactivateGuard` reads `user_roles` from sessionStorage. Each role entry exposes flags: `addFlag`, `editFlag`, `deleteFlag`, `viewFlag`, `fullAccessFlag`, `approveFlag`. Guards use these to permit/deny navigation.

### State Management

No NgRx. State flows through:
- **SessionStorage**: `user_data`, `user_roles`, `languageId` — set on login, read everywhere.
- **AuthService** (`src/app/common-methods/services/auth.service.ts`): Central auth state, API URL resolution, PDF type mapping, config loading via `APP_INITIALIZER`.
- **SharedService** (`src/app/common-methods/services/shared.service.ts`): Cross-component communication via RxJS Subjects (e.g., `changeEmittedLoading$` for global spinner).
- **Service properties**: Transient in-memory state held directly on feature services.

### HTTP & API Integration

**Interceptor** (`src/app/interceptor.ts`) handles:
- Attaches `Authorization: Bearer <token>` to all requests.
- Routes requests to the correct base URL:
  - Relative URLs → `config.json` `apiUrl`
  - Invoice endpoints → `config.json` `invoiceapiUrl`
  - Document requests → `config.json` `documentUrl` (also sets `responseType: arraybuffer`)
  - Absolute `http/https` URLs → pass through

**Runtime config** is loaded from `src/config.json` (not bundled into the build — edit it in the output `dist/` folder for environment-specific deployments):
```json
{
  "apiUrl": "http://localhost:62414/api/",
  "invoiceapiUrl": "http://localhost:5003/api/",
  "expressUrl": "http://localhost:62414",
  "documentUrl": "...",
  "redirectUri": "http://localhost:4200/auth-callback"
}
```

### Authentication

OAuth2/OIDC via `angular-oauth2-oidc`. SSO flow uses `/ssologin` → `/auth-callback`. Silent token refresh uses `src/silent-refresh.html`.

### Dynamic Forms (Screening Module)

`DynamicControlService` generates form fields at runtime. The `screening/DynamicComponents/` directory contains individual form-section components (Employment, Education, PAN, Drug Test, Address, License, Passport, UAN, etc.) composed into screening workflows.

### Key UI Libraries

- **Angular Material 12**: Dialogs (`MatDialog`), form controls, date picker. Common dialogs registered as `entryComponents`: `CommonDialogComponent`, `CommonAlertsComponent`.
- **Kendo UI (Progress)**: Grid, dropdowns, date inputs, Excel/PDF export — used heavily in lists and reports.
- **PrimeNG 9**: Calendar, Toast notifications.
- **ngx-spinner**: Global loading spinner toggled via `SharedService`.
- **@agm/core**: Google Maps integration.
- **@aspnet/signalr**: Real-time notifications.

### Build Budgets

Production build enforces: initial bundle ≤ 15MB (warning) / 25MB (error), component styles ≤ 6KB. If a bundle exceeds limits, check for large Kendo/PrimeNG imports and use specific sub-imports.

### Spec Files

`angular.json` schematics disable spec generation by default for components, classes, and services. Write tests manually when needed.
