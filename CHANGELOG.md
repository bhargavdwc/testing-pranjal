# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Frontend**:
  - Replaced success emoji with a CheckCircle SVG icon in `ContactSection.tsx`.
- **Lead CRM Funnel Backend**:
  - Created `Lead.js` Mongoose model for storing applicant data.
  - Added `leads.js` routes (`POST /`, `GET /`, `GET /stats`, `PUT /:id/status`, `PUT /:id`, `DELETE /:id`).
  - Added notification templates to `sendEmail.js` using `nodemailer` (Gmail SMTP).
  - Updated `server.js` to mount lead API routes.
- **Lead CRM Funnel Frontend**:
  - Implemented client-side routing using `react-router-dom` in `main.tsx` and `App.tsx` (to distinguish `/admin` from the landing page).
  - Connected the Contact Section form to the API endpoint and added a phone number field.
  - Added 10-digit phone number validation to the Contact Section form with field-level restriction to digits only.
  - Updated the Contact Section form success message to display inline instead of completely replacing the form.
  - Added `Leads CRM` tab in `AdminPage.tsx` with full CRUD and funnel tracking logic.
  - Added "Applied Date" column to the Leads CRM table for better tracking.
  - Fixed pre-existing TypeScript types and build issues inside `AdminPage.tsx`.
- **Branding Update**:
  - Updated the Admin Dashboard title and login visual from "pranjal" to "Product Leadership Studio".
- **Codebase Refactoring**:
  - Refactored `AdminPage.tsx` monolithic component into modular files.
  - Created modular sub-components in `src/admin/components` (Login, Sidebar, OverviewTab, LeadsTab, LeadModal, LogoutModal).
  - Extracted type definitions and constants to `src/admin/types.ts` and `src/admin/constants.ts`.

### Fixed
  - Fixed the backend `leads.js` API route to properly parse and handle the Custom Date Range filter query parameters.
- Added `vercel.json` to the frontend to fix 404 NOT_FOUND errors on client-side routes (like `/admin`) during Vercel deployment.
- Fixed TypeScript errors with missing `types.ts` imports and implicit `any` usage.
- Fixed an unresolved image import (`logo.png`) breaking the frontend build.
