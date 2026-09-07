# Enterprise HRMS SaaS Platform
## Complete PostgreSQL Database Blueprint - Part 2

*(Continuing from Part 1, adhering strictly to the Database Standards: UUID PKs, Tenant Isolation, Audit Columns, Optimistic Concurrency, and RLS).*

---

## 7. RECRUITMENT & ONBOARDING

### 7.1 Table: `jobs`
**Purpose:** Requisitions and job postings.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | FK (`tenants.id`) |
| `title` | VARCHAR | 255 | N | | |
| `department_id` | UUID | | N | | FK (`departments.id`) |
| `work_location_id`| UUID | | N | | FK (`branches.id`) |
| `employment_type`| VARCHAR | 50 | N | | |
| `headcount` | INT | | N | 1 | |
| `description` | TEXT | | N | | |
| `requirements` | TEXT | | Y | | |
| `min_salary` | NUMERIC | 12,2| Y | | |
| `max_salary` | NUMERIC | 12,2| Y | | |
| `status` | VARCHAR | 50 | N | 'Draft' | 'Draft', 'Published', 'Closed'|
| `published_at` | TIMESTAMPTZ| | Y | | |

### 7.2 Table: `candidates`
**Purpose:** Applicant tracking.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `job_id` | UUID | | N | | FK (`jobs.id`) |
| `first_name` | VARCHAR | 100 | N | | |
| `last_name` | VARCHAR | 100 | N | | |
| `email` | VARCHAR | 255 | N | | UNIQUE(tenant_id, job_id, email)|
| `phone` | VARCHAR | 50 | Y | | |
| `resume_url` | VARCHAR | 500 | N | | |
| `source` | VARCHAR | 100 | Y | 'LinkedIn'| |
| `status` | VARCHAR | 50 | N | 'Applied' | 'Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'|
| `rating` | INT | | Y | | 1 to 5 |

### 7.3 Table: `interviews`
**Purpose:** Interview scheduling and feedback.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `candidate_id` | UUID | | N | | FK (`candidates.id`) |
| `panelist_id` | UUID | | N | | FK (`employees.id`) |
| `scheduled_at` | TIMESTAMPTZ| | N | | |
| `duration_mins` | INT | | N | 60 | |
| `meeting_link` | VARCHAR | 500 | Y | | |
| `status` | VARCHAR | 50 | N | 'Scheduled'| |
| `feedback` | TEXT | | Y | | |
| `score` | NUMERIC | 4,2 | Y | | |

### 7.4 Table: `onboarding_tasks`
**Purpose:** New hire integration checklist.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `employee_id` | UUID | | N | | FK (`employees.id`) |
| `task_name` | VARCHAR | 255 | N | | |
| `description` | TEXT | | Y | | |
| `assigned_to` | UUID | | N | | FK (`employees.id`) |
| `due_date` | DATE | | N | | |
| `status` | VARCHAR | 50 | N | 'Pending' | 'Pending', 'In Progress', 'Completed'|

---

## 8. PERFORMANCE & TRAINING

### 8.1 Table: `review_cycles`
**Purpose:** Manage company-wide appraisal cycles.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `name` | VARCHAR | 255 | N | | e.g., 'Q3 2026 Appraisal' |
| `start_date` | DATE | | N | | |
| `end_date` | DATE | | N | | |
| `status` | VARCHAR | 50 | N | 'Active' | |

### 8.2 Table: `goals` (OKRs)
**Purpose:** Employee/Department objectives.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `owner_type` | VARCHAR | 50 | N | 'Employee'| 'Employee', 'Department', 'Company'|
| `owner_id` | UUID | | N | | FK (Polymorphic) |
| `review_cycle_id`| UUID | | Y | | FK (`review_cycles.id`) |
| `title` | VARCHAR | 255 | N | | |
| `description` | TEXT | | Y | | |
| `weightage` | NUMERIC | 5,2 | N | 100.00 | |
| `progress_pct` | NUMERIC | 5,2 | N | 0.00 | |
| `status` | VARCHAR | 50 | N | 'On Track'| |

### 8.3 Table: `courses`
**Purpose:** L&D module catalog.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `title` | VARCHAR | 255 | N | | |
| `provider` | VARCHAR | 255 | Y | 'Internal'| |
| `is_mandatory` | BOOLEAN | | N | false | |

---

## 9. ASSETS & HELP DESK

### 9.1 Table: `assets`
**Purpose:** Hardware and software inventory.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `category` | VARCHAR | 50 | N | | 'Laptop', 'Phone', 'License' |
| `asset_tag` | VARCHAR | 100 | N | | UNIQUE |
| `serial_number` | VARCHAR | 100 | Y | | |
| `purchase_date` | DATE | | Y | | |
| `value` | NUMERIC | 10,2| Y | | |
| `status` | VARCHAR | 50 | N | 'Available'| 'Available', 'Assigned', 'Retired' |

### 9.2 Table: `asset_assignments`
**Purpose:** Track who has what asset.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `asset_id` | UUID | | N | | FK (`assets.id`) |
| `employee_id` | UUID | | N | | FK (`employees.id`) |
| `assigned_date` | DATE | | N | `current_date`| |
| `returned_date` | DATE | | Y | | |
| `condition_out` | VARCHAR | 255 | Y | | |
| `condition_in` | VARCHAR | 255 | Y | | |

### 9.3 Table: `tickets`
**Purpose:** Internal Help Desk (IT/HR support).
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `requester_id` | UUID | | N | | FK (`employees.id`) |
| `assignee_id` | UUID | | Y | | FK (`employees.id`) |
| `category` | VARCHAR | 50 | N | 'IT' | 'IT', 'HR', 'Payroll', 'Facilities'|
| `priority` | VARCHAR | 20 | N | 'Medium' | 'Low', 'Medium', 'High', 'Urgent'|
| `subject` | VARCHAR | 255 | N | | |
| `description` | TEXT | | N | | |
| `status` | VARCHAR | 50 | N | 'Open' | 'Open', 'In Progress', 'Resolved'|

---

## 10. PROJECTS & TIME TRACKING

### 10.1 Table: `projects`
**Purpose:** Client or internal projects.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `name` | VARCHAR | 255 | N | | |
| `client_name` | VARCHAR | 255 | Y | | |
| `manager_id` | UUID | | N | | FK (`employees.id`) |
| `status` | VARCHAR | 50 | N | 'Active' | |

### 10.2 Table: `timesheets`
**Purpose:** Billable and non-billable hours tracking.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `employee_id` | UUID | | N | | FK (`employees.id`) |
| `project_id` | UUID | | N | | FK (`projects.id`) |
| `date` | DATE | | N | | |
| `hours_worked` | NUMERIC | 4,2 | N | | |
| `is_billable` | BOOLEAN | | N | true | |
| `status` | VARCHAR | 50 | N | 'Submitted'| 'Submitted', 'Approved', 'Rejected'|

*(This represents the continuation of the core Enterprise schemas. All standard columns including `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `is_active`, and `version` are implicitly included on every table as per the Database Standard Overview.)*
