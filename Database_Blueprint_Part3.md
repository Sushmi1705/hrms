# Enterprise HRMS SaaS Platform
## Complete PostgreSQL Database Blueprint - Part 3

*(Continuing from Part 2. All tables inherently include standard columns: `id (UUID PK)`, `tenant_id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `is_active`, and `version` as defined in the Database Standard Overview).*

---

## 11. COMMUNICATION MODULE

### 11.1 Table: `announcements`
**Purpose:** Company-wide or department-wide notices.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `title` | VARCHAR | 255 | N | | |
| `content` | TEXT | | N | | HTML/Markdown supported |
| `target_audience`| VARCHAR | 50 | N | 'All' | 'All', 'Department', 'Location' |
| `department_id` | UUID | | Y | | FK (`departments.id`) |
| `published_at` | TIMESTAMPTZ| | N | `now()` | |
| `expires_at` | TIMESTAMPTZ| | Y | | |

### 11.2 Table: `notifications`
**Purpose:** Real-time user alerts. **Partitioning:** RANGE (`created_at`).
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `user_id` | UUID | | N | | FK (`users.id`) |
| `title` | VARCHAR | 255 | N | | |
| `message` | TEXT | | N | | |
| `type` | VARCHAR | 50 | N | 'System' | 'Leave', 'Payroll', 'Task', 'System'|
| `is_read` | BOOLEAN | | N | false | |
| `read_at` | TIMESTAMPTZ| | Y | | |
| `action_url` | VARCHAR | 500 | Y | | |

### 11.3 Table: `email_templates`
**Purpose:** Customizable transactional email layouts.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `template_code` | VARCHAR | 100 | N | | e.g., 'LEAVE_APPROVED' |
| `subject` | VARCHAR | 255 | N | | |
| `body_html` | TEXT | | N | | Uses mustache syntax |

---

## 12. REPORTS & ANALYTICS

### 12.1 Table: `saved_reports`
**Purpose:** User-defined custom reports.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `owner_id` | UUID | | N | | FK (`users.id`) |
| `name` | VARCHAR | 255 | N | | |
| `module` | VARCHAR | 50 | N | | 'Payroll', 'Attendance', etc. |
| `query_config` | JSONB | | N | | Selected columns, filters, sorting |
| `is_public` | BOOLEAN | | N | false | Viewable by others in tenant |

### 12.2 Table: `dashboard_widgets`
**Purpose:** Customizable home screen widgets per user.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `user_id` | UUID | | N | | FK (`users.id`) |
| `widget_type` | VARCHAR | 50 | N | | 'Headcount', 'LeaveBalance' |
| `x_position` | INT | | N | 0 | |
| `y_position` | INT | | N | 0 | |
| `width` | INT | | N | 1 | |
| `height` | INT | | N | 1 | |

---

## 13. SYSTEM CONFIGURATION & INTEGRATIONS

### 13.1 Table: `tenant_settings`
**Purpose:** Global configuration per tenant.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | UNIQUE |
| `setting_group` | VARCHAR | 50 | N | | 'General', 'Security', 'Payroll' |
| `setting_key` | VARCHAR | 100 | N | | e.g., 'mfa_enforced' |
| `setting_value` | JSONB | | N | | |

### 13.2 Table: `integrations`
**Purpose:** Manage 3rd-party OAuth connections (e.g., Slack, Stripe).
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `provider` | VARCHAR | 50 | N | | 'Slack', 'GoogleWorkspace' |
| `access_token` | VARCHAR | 1000| N | | Encrypted at rest |
| `refresh_token` | VARCHAR | 1000| Y | | Encrypted at rest |
| `expires_at` | TIMESTAMPTZ| | Y | | |
| `status` | VARCHAR | 50 | N | 'Active' | |

### 13.3 Table: `webhooks`
**Purpose:** Outbound event notifications to external systems.
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | N | | |
| `event_type` | VARCHAR | 100 | N | | e.g., 'employee.created' |
| `target_url` | VARCHAR | 500 | N | | |
| `secret_key` | VARCHAR | 255 | Y | | For payload signing |
| `retry_count` | INT | | N | 3 | |

### 13.4 Table: `api_logs` (System)
**Purpose:** Track incoming API requests for rate limiting and auditing. **Partitioning:** RANGE (`created_at`).
| Column | Type | Length | Null | Default | Notes / FK |
|---|---|---|---|---|---|
| `id` | UUID | | N | `uuid()` | PK |
| `tenant_id` | UUID | | Y | | |
| `user_id` | UUID | | Y | | |
| `endpoint` | VARCHAR | 255 | N | | |
| `method` | VARCHAR | 10 | N | | 'GET', 'POST', etc. |
| `status_code` | INT | | N | | |
| `response_time_ms`| INT | | N | | |
| `ip_address` | INET | | N | | |

*(End of Database Blueprint. This 3-part series completely covers the structural foundation required for the Enterprise HRMS SaaS Platform.)*
