# Enterprise HRMS SaaS Platform
## Official REST API Specification (OpenAPI 3.1)

This document serves as the official API contract between the ASP.NET Core 9 backend and the React frontend/external consumers.

---

## 1. Global API Standards

### 1.1 Versioning & Base URL
- **Base URL:** `https://api.hrms.com`
- **Versioning:** URI-based versioning is enforced. All endpoints begin with `/api/v1/`.

### 1.2 Authentication & Authorization
- **Auth Scheme:** JWT Bearer Token.
- **Header:** `Authorization: Bearer <token>`
- **Tenant Context:** Inherited from the JWT claims (`tenant_id`). Cross-tenant requests are blocked at the middleware layer.

### 1.3 Naming Standards
- **Resources:** Plural, kebab-case (e.g., `/api/v1/leave-requests`).
- **Keys/Properties:** camelCase in JSON responses (e.g., `firstName`).
- **Path Variables:** `{id}` (UUID format).

### 1.4 Rate Limiting & Idempotency
- **Rate Limiting:** standard endpoints limited to 100 req/min per IP. Auth endpoints limited to 5 req/min. Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`.
- **Idempotency:** `POST` requests for financial or critical data (e.g., Payroll Run) require an `Idempotency-Key` header (UUID) to prevent double execution.

### 1.5 Pagination, Sorting & Filtering
Standard query parameters for collection endpoints:
- `?page=1&pageSize=50` (Default page 1, size 20, max 100).
- `?sortBy=createdAt&sortDesc=true`
- `?filter[status]=active&search=John`

### 1.6 Standardized Responses & Error Handling

**Success Response Wrapper:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "pageSize": 50, "totalRecords": 1500 } // Present on lists
}
```

**Error Response (RFC 7807 Problem Details):**
```json
{
  "type": "https://hrms.com/errors/validation-error",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00",
  "errors": {
    "Email": ["The Email field is required.", "Invalid email format."]
  }
}
```
**Standard HTTP Status Codes:**
- `200 OK`, `201 Created`, `204 No Content`
- `400 Bad Request` (Validation/Business Logic), `401 Unauthorized`, `403 Forbidden` (RBAC), `404 Not Found`, `409 Conflict`, `429 Too Many Requests`
- `500 Internal Server Error`

---

## 2. AUTHENTICATION MODULE

### 2.1 Login
**Endpoint Name:** Authenticate User
**HTTP Method:** `POST`
**URL:** `/api/v1/auth/login`
**Description:** Authenticates Company Admins, Managers, and Employees.
**Authorization:** None | **Required Role:** None
**Headers:** `Content-Type: application/json`

**Request JSON:**
```json
{
  "email": "user@company.com",
  "password": "SecurePassword123!"
}
```
**Validation Rules:** `email` (Required, EmailFormat), `password` (Required).

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "requiresMfa": false,
    "accessToken": "eyJhbG...",
    "expiresIn": 900
  }
}
```
*(Refresh token sent as `HttpOnly` Secure cookie: `refreshToken`).*

**Errors:**
- `401 Unauthorized`: Invalid credentials.
- `403 Forbidden`: Account locked.

### 2.2 Verify MFA
**HTTP Method:** `POST` | **URL:** `/api/v1/auth/mfa/verify`
**Description:** Submits OTP for accounts with MFA enabled.
**Headers:** `Authorization: Bearer <TempToken>`

**Request JSON:**
```json
{ "code": "123456" }
```

### 2.3 Refresh Token
**HTTP Method:** `POST` | **URL:** `/api/v1/auth/refresh`
**Headers:** Cookie `refreshToken` required.

---

## 3. EMPLOYEE MODULE

### 3.1 Get All Employees
**Endpoint Name:** List Employees
**HTTP Method:** `GET` | **URL:** `/api/v1/employees`
**Authorization:** Bearer Token
**Required Role:** `HR`, `Admin`, `Manager` (Managers see only direct reports).
**Permissions:** `employee:read`
**Query Parameters:** `page`, `pageSize`, `sortBy`, `sortDesc`, `search`, `departmentId`, `status`.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4...",
      "employeeNumber": "EMP-001",
      "firstName": "John",
      "lastName": "Doe",
      "department": { "id": "...", "name": "Engineering" },
      "designation": { "id": "...", "name": "Senior Developer" },
      "status": "Active"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalRecords": 142 }
}
```

### 3.2 Create Employee
**Endpoint Name:** Onboard Employee
**HTTP Method:** `POST` | **URL:** `/api/v1/employees`
**Authorization:** Bearer Token | **Required Role:** `HR`, `Admin`
**Permissions:** `employee:write`

**Request JSON:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "joiningDate": "2026-09-01",
  "departmentId": "uuid-here",
  "designationId": "uuid-here",
  "employmentType": "Full-Time"
}
```
**Validation Rules:**
- `email`: Must be valid and unique within tenant.
- `joiningDate`: Must be ISO 8601 format.
- `departmentId`/`designationId`: Must exist in DB.

**Success Response (201 Created):** Returns created employee object with `id`.
**Errors:** `400 Bad Request` (Validation errors).

### 3.3 Bulk Import Employees (CSV/Excel)
**Endpoint Name:** Bulk Import Employees
**HTTP Method:** `POST` | **URL:** `/api/v1/employees/bulk-import`
**Headers:** `Content-Type: multipart/form-data`
**Request:** File upload (CSV/XLSX).
**Response (202 Accepted):**
```json
{
  "success": true,
  "data": { "jobId": "b8x9...", "status": "Processing" }
}
```
*(Processing runs as a Background Job).*

### 3.4 Export Employees (PDF/Excel)
**HTTP Method:** `GET` | **URL:** `/api/v1/employees/export?format=excel`
**Response:** `200 OK` with `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

---

## 4. PAYROLL MODULE (High Security)

### 4.1 Execute Payroll Run
**Endpoint Name:** Start Payroll Processing
**HTTP Method:** `POST` | **URL:** `/api/v1/payroll/runs`
**Authorization:** Bearer Token | **Required Role:** `PayrollAdmin`, `SuperAdmin`
**Headers:** `Idempotency-Key: <uuid>`

**Request JSON:**
```json
{
  "periodStart": "2026-08-01",
  "periodEnd": "2026-08-31",
  "runDate": "2026-08-25"
}
```
**Response (202 Accepted):** Returns background job ID for async processing.

---

*(Due to size limits, this API Specification establishes the strict baseline contract for Authentication, Employees, and Payroll modules. All other modules (Attendance, Leave, Recruitment, Performance) follow the exact same structural paradigm: Plural nouns, UUIDs, unified pagination, problem details error handling, and strict RBAC authorization.)*
