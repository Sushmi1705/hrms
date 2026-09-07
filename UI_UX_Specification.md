# Enterprise HRMS SaaS Platform
## Official UI/UX Design Specification

This document serves as the official UI/UX blueprint for the frontend development team using **React 19, TypeScript, Tailwind CSS, and Shadcn UI**. It dictates the design system, navigation, page structures, and user flows to ensure a highly cohesive, accessible, and responsive enterprise application.

---

## 1. Complete Design System

### 1.1 Colors (Tailwind Variables)
- **Primary:** `hsl(221, 83%, 53%)` (Enterprise Blue) - Used for primary actions, active states.
- **Secondary:** `hsl(210, 40%, 96.1%)` - Used for secondary buttons, subtle backgrounds.
- **Destructive/Error:** `hsl(0, 84.2%, 60.2%)` - Used for delete actions, validation errors.
- **Success:** `hsl(142.1%, 76.2%, 36.3%)` - Used for approved states, success toasts.
- **Warning:** `hsl(38, 92%, 50%)` - Used for pending states, warnings.
- **Background (Light):** `hsl(0, 0%, 100%)` | **Background (Dark):** `hsl(222.2, 84%, 4.9%)`
- **Text (Light Mode):** `hsl(222.2, 84%, 4.9%)` | **Text (Dark Mode):** `hsl(210, 40%, 98%)`

### 1.2 Typography (Inter Font Family)
- **H1:** 36px, Bold, Tracking Tight (-0.02em) - Page Titles.
- **H2:** 24px, SemiBold - Section Headers.
- **H3:** 20px, SemiBold - Card Headers, Modals.
- **Body:** 14px, Regular - Standard text, tables, form inputs.
- **Small:** 12px, Medium - Helper text, badges, timestamps.

### 1.3 Borders, Spacing & Shadows
- **Border Radius:** `0.5rem` (8px) for Cards, Inputs, Buttons. `0.25rem` for Badges.
- **Spacing Base:** `0.25rem` (Tailwind `p-1`). Standard padding for Cards is `p-6`.
- **Shadows:** 
  - Subdued: `shadow-sm` (Buttons, Inputs).
  - Elevated: `shadow-md` (Cards, Dropdowns).
  - Floating: `shadow-lg` (Modals, Dialogs).

### 1.4 Accessibility (WCAG 2.1 AA)
- Minimum contrast ratio of 4.5:1 for normal text.
- All interactive elements must have `:focus-visible` ring (`ring-2 ring-primary ring-offset-2`).
- Screen reader support via `aria-labels` and `aria-describedby` for form errors.

---

## 2. Navigation Structure

### 2.1 Top Navigation (Global)
- **Left:** Company Logo & Breadcrumbs (e.g., `Home > Employees > John Doe`).
- **Right:** Global Search (`Ctrl+K`), Notifications Bell (with unread badge), Theme Toggle (Sun/Moon), User Profile Dropdown.

### 2.2 Sidebar Menu (Role-Based)
**Super Admin:**
- Dashboard | Tenants/Companies | Subscriptions | Plans | Billing | Users | Audit Logs | Settings

**Company Admin & HR:**
- Dashboard | Organization (Branches, Depts) | Employees | Attendance | Leave | Payroll | Recruitment | Performance | Training | Assets | Reports | Settings

**Manager:**
- Dashboard | My Team | Team Attendance | Leave Approvals | Performance Reviews | Projects

**Employee:**
- Dashboard | My Profile | Attendance (Web Clock) | My Leaves | Payslips | Assets | Help Desk Tickets

### 2.3 Profile Menu Dropdown
- Avatar (Initials or Image)
- Name & Designation
- Link: "My Profile"
- Link: "Account Settings"
- Divider
- Action: "Logout" (Red text)

---

## 3. Standard CRUD Page Specification

All CRUD modules (Employees, Leave, Assets, etc.) follow a strict, unified architectural layout.

### 3.1 List Screen (Data Table)
- **Purpose:** View, filter, and select records.
- **Top Bar:** Page Title (H1), "Add New" Button (Primary), "Export" Dropdown (CSV/Excel).
- **Controls:** Global Search Input, Filter Button (opens Shadcn Sheet with advanced filters), View Toggle (Table/Grid).
- **Table Component:**
  - Sticky header.
  - Sortable columns.
  - Row Selection (Checkboxes) for Bulk Actions (Delete, Update).
  - Actions Column: Dropdown (`...`) with View, Edit, Delete.
- **Footer:** Pagination Controls (Rows per page, Previous/Next, Page numbers).
- **Empty State:** Illustration, "No records found", "Clear Filters" or "Create First Record" button.
- **Loading State:** Skeleton loader matching table rows.

### 3.2 Create / Edit Screen (Forms)
- **Layout:** Shadcn Form inside a Card (or full-page layout for complex entities like Employees).
- **Structure:** Multi-column grid (e.g., `grid-cols-2` on Desktop, `grid-cols-1` on Mobile).
- **Inputs:** Floating labels or standard labels with placeholders. Real-time Zod validation feedback below inputs.
- **Actions:** "Cancel" (Secondary, navigates back), "Save" / "Update" (Primary, shows spinner when submitting).
- **Unsaved Changes:** Browser confirmation dialog if attempting to leave with dirty fields.

### 3.3 View Screen (Details)
- **Layout:** Header with Avatar/Icon, Title, Status Badge, and "Edit" button.
- **Body:** Tabs component (e.g., Employee View has Tabs: Personal, Job, Payroll, Documents).
- **Content:** Data displayed in Read-Only Description Lists (`dl`, `dt`, `dd`).

### 3.4 Delete Confirmation
- **UI:** Shadcn AlertDialog.
- **Content:** "Are you sure you want to delete [Item Name]? This action cannot be undone."
- **Actions:** "Cancel", "Delete" (Destructive red button, spinner on click).

---

## 4. Dashboard Wireframes

### 4.1 HR / Company Admin Dashboard
- **Welcome Banner:** "Good morning, [Name]." Quick summary text.
- **KPI Cards (Row 1):** Total Employees, Active on Leave Today, Pending Approvals, Monthly Payroll Run.
- **Charts (Row 2):** 
  - Left (60%): Headcount Trend (Area Chart - Recharts).
  - Right (40%): Attrition Rate by Department (Donut Chart).
- **Widgets (Row 3):**
  - Left: Pending Approvals Task List (Leave, Expenses).
  - Right: Upcoming Birthdays & Work Anniversaries.

### 4.2 Employee Dashboard
- **KPI Cards:** Available Leave Balance, Next Holiday.
- **Action Widget:** Large Web Clock-In/Out Button (Green/Red based on state).
- **Quick Links:** "Request Leave", "View Payslip", "Raise Ticket".
- **Timeline Widget:** Recent company announcements.

---

## 5. Complete User Flows

### 5.1 Leave Approval Flow
1. **Employee:** Clicks "Request Leave".
2. **Modal Opens:** Selects Leave Type, Start/End Date. System auto-calculates days and checks against balance.
3. **Submit:** Clicks "Submit Request". Success Toast appears. State changes to "Pending".
4. **Manager Notification:** Receives Real-time Bell Notification and Email.
5. **Manager Action:** Clicks notification -> Opens Leave Request View drawer.
6. **Approval:** Manager clicks "Approve". Dialog prompts for optional comment. Confirms.
7. **Resolution:** Status updates to "Approved" (Green Badge). Employee receives notification. Balance is deducted in UI.

### 5.2 Payroll Processing Flow (Admin)
1. **Initiate:** HR clicks "Run Payroll" -> Selects Date Range.
2. **Review Screen (Data Grid):** System displays pre-calculated gross, deductions, and net pay for all employees. Rows with anomalies (e.g., unpaid leave) are highlighted with Warning Badges.
3. **Edit:** HR clicks an employee row to manually override a deduction (opens side drawer).
4. **Finalize:** HR clicks "Finalize Payroll".
5. **Confirmation:** System prompts for MFA/Password confirmation due to financial action.
6. **Processing State:** Page shows progress bar (polling background job status via TanStack Query).
7. **Success:** Transition to "Payslips Generated" view with "Publish to Employees" action.

---

## 6. Design Standards & Rules

### 6.1 Loading Guidelines
- **Initial Page Load:** Top progress bar (NProgress/TopBar).
- **Component Load (Data Fetching):** Skeleton loaders matching the exact shape of the incoming data. NEVER use full-screen blocking spinners for data fetches.
- **Button Actions (Mutations):** Button text is replaced by a spinner, and the button is disabled to prevent double-clicks.

### 6.2 Error Handling UI
- **Form Errors:** Inline red text immediately below the input field. Input border turns red.
- **API Errors (Toast):** Shadcn Toast notification at bottom-right. Red background, descriptive message (e.g., "Failed to save: Email already exists").
- **Catastrophic Errors (Error Boundaries):** Full-page fallback UI with an illustration, "Something went wrong", and a "Reload Page" button.

### 6.3 Responsive Rules (Mobile-First approach adapted for Enterprise)
- **Enterprise Default:** Desktop-first logic since 90% of HR/Admin tasks occur on laptops.
- **Mobile (Employees):** Employee-facing pages (Profile, Leave Request, Payslips, Clock-In) MUST be perfectly optimized for mobile.
- **Tables on Mobile:** Standard tables convert to Card Lists on screens `< 768px` to prevent horizontal scrolling nightmares.
- **Sidebars:** Collapse into a Hamburger Menu (Shadcn Sheet) on Mobile/Tablet.

### 6.4 Animation Guidelines
- **Micro-interactions:** 150ms ease-in-out transitions on button hovers and list item focuses.
- **Dialogs/Modals:** scale-in-up (95% to 100% scale, 0 to 1 opacity) over 200ms.
- **Drawers (Slide-overs):** slide-in-from-right over 300ms.
- Avoid heavy, distracting animations. Enterprise tools should feel snappy and instantaneous.

---
*(This document outlines the strict UI/UX architectural requirements. Frontend engineers are expected to build a standalone Shadcn Component Library enforcing these tokens before beginning page-level development.)*
