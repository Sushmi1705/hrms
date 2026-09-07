using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Bogus;
using HRMS.Domain.Entities.Workflow;
using HRMS.Persistence;

namespace HRMS.Persistence.Seeders;

public class WorkflowSeeder
{
    private readonly HrmsDbContext _context;

    public WorkflowSeeder(HrmsDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        if (_context.WorkflowDefinitions.Any(w => w.Steps.Any()))
        {
            return;
        }

        // Clean up any incomplete old definitions if any
        if (_context.WorkflowDefinitions.Any())
        {
            _context.WorkflowConditions.RemoveRange(_context.WorkflowConditions);
            _context.WorkflowSteps.RemoveRange(_context.WorkflowSteps);
            _context.WorkflowVersions.RemoveRange(_context.WorkflowVersions);
            _context.ApprovalTasks.RemoveRange(_context.ApprovalTasks);
            _context.ApprovalHistories.RemoveRange(_context.ApprovalHistories);
            _context.ApprovalComments.RemoveRange(_context.ApprovalComments);
            _context.WorkflowEscalations.RemoveRange(_context.WorkflowEscalations);
            _context.Delegations.RemoveRange(_context.Delegations);
            _context.WorkflowTemplates.RemoveRange(_context.WorkflowTemplates);
            _context.ApprovalRequests.RemoveRange(_context.ApprovalRequests);
            _context.WorkflowDefinitions.RemoveRange(_context.WorkflowDefinitions);
            _context.SaveChanges();
        }

        var faker = new Faker();

        // 1. Create 22 Enterprise Workflow Definitions across all modules
        var workflowConfigs = new List<(string Code, string Name, string Module, string Category, string Desc, string Trigger, List<(string Key, string Name, string Type, int Sla, bool Esc, string EscTo, string Mode)> Steps)>
        {
            ("WF-LV-01", "Standard Annual Leave Approval", "Leave", "Core HR", "Standard 2-tier leave request approval process", "OnSubmit", new() {
                ("mgr_review", "Manager Direct Approval", "EmployeeManager", 24, true, "HR", "AnyOne"),
                ("hr_review", "HR Operations Verification", "HR", 48, false, "None", "AnyOne")
            }),
            ("WF-LV-02", "Emergency & Extended Sick Leave", "Leave", "Core HR", "Fast-tracked health and medical emergency leave", "OnSubmit", new() {
                ("doc_check", "HR Medical Verification", "HR", 12, true, "HRManager", "AnyOne"),
                ("dept_head", "Department Head Sign-off", "DepartmentManager", 24, false, "None", "AnyOne")
            }),
            ("WF-LV-03", "Maternity & Paternity Leave", "Leave", "Core HR", "Statutory parental leave compliance workflow", "OnSubmit", new() {
                ("hr_lead", "HR Benefits Lead", "HR", 24, false, "None", "AnyOne"),
                ("ops_plan", "Workforce Operations Planning", "DepartmentManager", 48, false, "None", "AnyOne")
            }),
            ("WF-ATT-01", "Attendance Regularization Workflow", "Attendance", "Operations", "Regularize missed check-in/check-out timestamps", "OnSubmit", new() {
                ("mgr_signoff", "Line Manager Review", "EmployeeManager", 24, true, "DepartmentManager", "AnyOne")
            }),
            ("WF-ATT-02", "Overtime Pre-Approval & Verification", "Attendance", "Operations", "Multi-stage overtime allocation authorization", "OnSubmit", new() {
                ("sup_appr", "Shift Supervisor Review", "EmployeeManager", 12, true, "DepartmentManager", "AnyOne"),
                ("dept_appr", "Operations Head Approval", "DepartmentManager", 24, false, "None", "AnyOne"),
                ("payroll_sync", "Payroll OT Authorization", "Payroll", 24, false, "None", "AnyOne")
            }),
            ("WF-ATT-03", "Shift Swap & Schedule Exemption", "Attendance", "Operations", "Peer-to-peer shift schedule swap authorization", "OnSubmit", new() {
                ("peer_accept", "Target Colleague Acceptance", "SpecificUser", 12, false, "None", "AnyOne"),
                ("roster_mgr", "Roster Lead Authorization", "EmployeeManager", 24, false, "None", "AnyOne")
            }),
            ("WF-PAY-01", "Expense & Travel Reimbursement", "Payroll", "Finance", "Employee travel, meal, and business expense claims", "OnSubmit", new() {
                ("mgr_audit", "Manager Expense Verification", "EmployeeManager", 24, true, "DepartmentManager", "AnyOne"),
                ("fin_audit", "Finance Accounts Payable Audit", "Finance", 48, true, "Finance", "AnyOne"),
                ("cfo_sign", "Controller Sign-off", "Finance", 48, false, "None", "AnyOne")
            }),
            ("WF-PAY-02", "Employee Loan & Salary Advance", "Payroll", "Finance", "Corporate interest-free salary advance approval", "OnSubmit", new() {
                ("hr_eligibility", "HR Policy Verification", "HR", 24, false, "None", "AnyOne"),
                ("fin_disburse", "Treasury & Finance Head", "Finance", 48, false, "None", "AnyOne")
            }),
            ("WF-PAY-03", "Monthly Payroll Cycle Sign-off", "Payroll", "Finance", "Monthly enterprise gross-to-net payroll authorization", "OnSubmit", new() {
                ("pay_analyst", "Payroll Specialist Audit", "Payroll", 24, false, "None", "AnyOne"),
                ("hr_director", "HR Director Sign-off", "HRManager", 24, false, "None", "AnyOne"),
                ("cfo_approval", "Chief Financial Officer Authorization", "Finance", 24, true, "Finance", "AnyOne")
            }),
            ("WF-REC-01", "Job Requisition Authorization", "Recruitment", "Talent", "New headcount budgeting and role opening sign-off", "OnSubmit", new() {
                ("dept_lead", "Department Head Approval", "DepartmentManager", 48, true, "HRManager", "AnyOne"),
                ("hr_recruiter", "Talent Acquisition Head", "HR", 24, false, "None", "AnyOne"),
                ("fin_budget", "Finance Headcount Allocation", "Finance", 48, false, "None", "AnyOne")
            }),
            ("WF-REC-02", "Job Offer & Compensation Approval", "Recruitment", "Talent", "Executive approval for candidate offer letters", "OnSubmit", new() {
                ("ta_mgr", "Talent Acquisition Lead", "HR", 24, false, "None", "AnyOne"),
                ("dept_mgr", "Hiring Department Head", "DepartmentManager", 24, true, "HRManager", "AnyOne"),
                ("comp_ben", "Compensation & Benefits Head", "HRManager", 24, false, "None", "AnyOne")
            }),
            ("WF-ONB-01", "New Hire Onboarding Equipment & IT", "Onboarding", "Operations", "Hardware, laptop, and security badge provisioning", "OnSubmit", new() {
                ("it_admin", "IT Provisioning Lead", "SpecificRole", 24, false, "None", "AnyOne"),
                ("facility_mgr", "Facilities & Badge Desk", "SpecificRole", 24, false, "None", "AnyOne")
            }),
            ("WF-ONB-02", "Probation Confirmation Review", "Onboarding", "Core HR", "3-month probation assessment and employment confirmation", "OnSubmit", new() {
                ("mgr_perf", "Manager Performance Scorecard", "EmployeeManager", 48, true, "HRManager", "AnyOne"),
                ("hr_conf", "HR People Partner Confirmation", "HR", 24, false, "None", "AnyOne")
            }),
            ("WF-PERF-01", "Annual Promotion & Grade Upgrade", "Performance", "Talent", "Merit-based promotion across job grade levels", "OnSubmit", new() {
                ("mgr_rec", "Manager Recommendation", "EmployeeManager", 48, false, "None", "AnyOne"),
                ("dept_eval", "Department Calibration Committee", "DepartmentManager", 72, false, "None", "Majority"),
                ("hr_vp", "VP Human Resources", "HRManager", 48, false, "None", "AnyOne")
            }),
            ("WF-PERF-02", "Off-Cycle Salary Revision", "Performance", "Finance", "Special market adjustment or retention salary hike", "OnSubmit", new() {
                ("mgr_just", "Manager Business Justification", "EmployeeManager", 24, false, "None", "AnyOne"),
                ("hr_lead", "HR Compensation Review", "HRManager", 48, true, "Finance", "AnyOne"),
                ("fin_controller", "Financial Controller Approval", "Finance", 48, false, "None", "AnyOne")
            }),
            ("WF-PERF-03", "Internal Department Transfer", "Performance", "Core HR", "Lateral employee transfer between business units", "OnSubmit", new() {
                ("curr_mgr", "Current Department Head Release", "DepartmentManager", 48, false, "None", "AnyOne"),
                ("new_mgr", "Receiving Department Head Acceptance", "DepartmentManager", 48, false, "None", "AnyOne"),
                ("hr_transfer", "HR People Operations Processing", "HR", 24, false, "None", "AnyOne")
            }),
            ("WF-AST-01", "Special IT Asset & Software License", "Asset", "IT", "High-end developer workstation or SaaS tool request", "OnSubmit", new() {
                ("mgr_endorse", "Manager Endorsement", "EmployeeManager", 24, false, "None", "AnyOne"),
                ("it_sec", "IT Security & Architecture Review", "SpecificRole", 48, false, "None", "AnyOne")
            }),
            ("WF-AST-02", "Company Vehicle & Equipment Assignment", "Asset", "Operations", "Corporate vehicle or physical industrial equipment dispatch", "OnSubmit", new() {
                ("fleet_mgr", "Fleet Operations Desk", "SpecificRole", 24, false, "None", "AnyOne"),
                ("admin_head", "Administration Head", "HRManager", 48, false, "None", "AnyOne")
            }),
            ("WF-DOC-01", "Official Employment & Visa Certificate", "Document", "Core HR", "Consulate letters, bank verification and service certs", "OnSubmit", new() {
                ("hr_ops", "HR Documentation Desk", "HR", 24, false, "None", "AnyOne")
            }),
            ("WF-OFF-01", "Employee Resignation & Exit Clearance", "Offboarding", "Core HR", "Voluntary resignation and multi-department clearance", "OnSubmit", new() {
                ("mgr_exit", "Line Manager Handover Sign-off", "EmployeeManager", 48, true, "HRManager", "AnyOne"),
                ("it_clear", "IT Asset Recovery & Account Revocation", "SpecificRole", 24, false, "None", "AnyOne"),
                ("fin_clear", "Finance & Final Settlement Clearance", "Finance", 48, false, "None", "AnyOne"),
                ("hr_exit", "HR Exit Interview & Relieving Letter", "HR", 24, false, "None", "AnyOne")
            }),
            ("WF-CUS-01", "Custom Flexible Working Arrangement", "CustomHR", "Core HR", "Hybrid / Remote work policy exception approval", "OnSubmit", new() {
                ("mgr_agree", "Line Manager Agreement", "EmployeeManager", 24, false, "None", "AnyOne"),
                ("hr_policy", "HR Policy & Compliance", "HR", 48, false, "None", "AnyOne")
            }),
            ("WF-CUS-02", "Corporate Conference & Training Sponsorship", "CustomHR", "Talent", "External certifications, bootcamps and summits", "OnSubmit", new() {
                ("mgr_lnd", "Manager Endorsement", "EmployeeManager", 24, false, "None", "AnyOne"),
                ("lnd_head", "Learning & Development Head", "HR", 48, false, "None", "AnyOne"),
                ("fin_budget", "Finance Budget Approval", "Finance", 48, false, "None", "AnyOne")
            })
        };

        var definitions = new List<WorkflowDefinition>();
        var allSteps = new List<WorkflowStep>();
        var allVersions = new List<WorkflowVersion>();

        foreach (var c in workflowConfigs)
        {
            var def = new WorkflowDefinition
            {
                Code = c.Code,
                Name = c.Name,
                Module = c.Module,
                Category = c.Category,
                Description = c.Desc,
                TriggerEvent = c.Trigger,
                Version = faker.Random.Int(1, 4),
                Status = "Active",
                CreatedBy = "System Administrator",
                CreatedAt = DateTime.UtcNow.AddMonths(-faker.Random.Int(2, 12)),
                PublishedAt = DateTime.UtcNow.AddMonths(-faker.Random.Int(1, 6)),
                PublishedBy = "HR Director",
                UsageCount = faker.Random.Int(45, 320),
                LastUsedAt = DateTime.UtcNow.AddDays(-faker.Random.Int(0, 5)),
                IsActive = true
            };

            int stepIdx = 1;
            foreach (var s in c.Steps)
            {
                var step = new WorkflowStep
                {
                    WorkflowDefinitionId = def.Id,
                    WorkflowDefinition = def,
                    StepKey = s.Key,
                    StepName = s.Name,
                    Description = $"Automated resolution for {s.Name}",
                    OrderIndex = stepIdx++,
                    ApproverType = s.Type,
                    ApprovalMode = s.Mode,
                    TimeoutHours = s.Sla,
                    EscalationEnabled = s.Esc,
                    EscalateAfterHours = s.Sla,
                    EscalateToType = s.EscTo,
                    AllowedActionsJson = "[\"Approve\",\"Reject\",\"RequestChanges\",\"Delegate\"]",
                    CreatedBy = "System Administrator"
                };

                // Add condition to some steps (e.g. Leave > 5 days, Expense > 2000)
                if (c.Module == "Leave" && step.OrderIndex == 2)
                {
                    step.Conditions.Add(new WorkflowCondition
                    {
                        WorkflowStepId = step.Id,
                        Field = "days",
                        Operator = "GreaterThan",
                        Value = "2",
                        Logic = "AND",
                        CreatedBy = "System Administrator"
                    });
                }
                else if (c.Module == "Payroll" && step.OrderIndex == 3)
                {
                    step.Conditions.Add(new WorkflowCondition
                    {
                        WorkflowStepId = step.Id,
                        Field = "amount",
                        Operator = "GreaterThan",
                        Value = "5000",
                        Logic = "AND",
                        CreatedBy = "System Administrator"
                    });
                }

                def.Steps.Add(step);
                allSteps.Add(step);
            }

            // Create past versions
            for (int v = 1; v < def.Version; v++)
            {
                allVersions.Add(new WorkflowVersion
                {
                    WorkflowDefinitionId = def.Id,
                    VersionNumber = v,
                    Status = "Superseded",
                    SchemaSnapshotJson = JsonSerializer.Serialize(new { def.Code, def.Name, def.Module, def.Category, def.Description, Steps = def.Steps.Select(s => new { s.StepKey, s.StepName, s.ApproverType, s.TimeoutHours }) }),
                    ChangeSummary = $"Version {v} archive for {def.Name}",
                    PublishedAt = def.CreatedAt.AddDays(v * 30),
                    PublishedBy = "HR Director",
                    CreatedBy = "HR Director"
                });
            }

            allVersions.Add(new WorkflowVersion
            {
                WorkflowDefinitionId = def.Id,
                VersionNumber = def.Version,
                Status = "Published",
                SchemaSnapshotJson = JsonSerializer.Serialize(new { def.Code, def.Name, def.Module, def.Category, def.Description, Steps = def.Steps.Select(s => new { s.StepKey, s.StepName, s.ApproverType, s.TimeoutHours }) }),
                ChangeSummary = $"Live version {def.Version} for {def.Name}",
                PublishedAt = def.PublishedAt ?? DateTime.UtcNow,
                PublishedBy = "HR Director",
                CreatedBy = "HR Director"
            });

            definitions.Add(def);
        }

        _context.WorkflowDefinitions.AddRange(definitions);
        _context.WorkflowSteps.AddRange(allSteps);
        _context.WorkflowVersions.AddRange(allVersions);
        _context.SaveChanges();

        // 2. Create Workflow Templates (14 Industry Standards)
        var templateList = new List<WorkflowTemplate>
        {
            new WorkflowTemplate { Code = "TPL-LV-01", Name = "Standard Leave Approval", Module = "Leave", Category = "Core HR", Description = "2-step Manager then HR review", Icon = "Calendar", IsActive = true, UsageCount = 142 },
            new WorkflowTemplate { Code = "TPL-ATT-01", Name = "Attendance Regularization", Module = "Attendance", Category = "Operations", Description = "Fast single-step Line Manager regularization", Icon = "Clock", IsActive = true, UsageCount = 89 },
            new WorkflowTemplate { Code = "TPL-PAY-01", Name = "Expense Reimbursement", Module = "Payroll", Category = "Finance", Description = "Manager → Finance AP → CFO 3-tier matrix", Icon = "CreditCard", IsActive = true, UsageCount = 210 },
            new WorkflowTemplate { Code = "TPL-REC-01", Name = "Job Offer Authorization", Module = "Recruitment", Category = "Talent", Description = "Talent Lead → Dept Head → Compensation Head", Icon = "Briefcase", IsActive = true, UsageCount = 65 },
            new WorkflowTemplate { Code = "TPL-ONB-01", Name = "IT & Hardware Provisioning", Module = "Onboarding", Category = "Operations", Description = "Parallel IT & Facilities hardware provisioning", Icon = "Laptop", IsActive = true, UsageCount = 112 },
            new WorkflowTemplate { Code = "TPL-PERF-01", Name = "Merit Promotion Workflow", Module = "Performance", Category = "Talent", Description = "Manager → Calibration Panel → VP HR approval", Icon = "Award", IsActive = true, UsageCount = 47 },
            new WorkflowTemplate { Code = "TPL-PERF-02", Name = "Off-Cycle Salary Revision", Module = "Performance", Category = "Finance", Description = "Manager justification with Finance Controller sign-off", Icon = "TrendingUp", IsActive = true, UsageCount = 38 },
            new WorkflowTemplate { Code = "TPL-OFF-01", Name = "Employee Exit Clearance", Module = "Offboarding", Category = "Core HR", Description = "4-stage manager, IT, finance and HR clearance", Icon = "UserMinus", IsActive = true, UsageCount = 29 },
            new WorkflowTemplate { Code = "TPL-AST-01", Name = "Special Asset Request", Module = "Asset", Category = "IT", Description = "Manager endorsement and IT security verification", Icon = "ShieldCheck", IsActive = true, UsageCount = 74 },
            new WorkflowTemplate { Code = "TPL-DOC-01", Name = "Employment Verification Doc", Module = "Document", Category = "Core HR", Description = "1-click HR documentation desk fulfillment", Icon = "FileText", IsActive = true, UsageCount = 180 }
        };
        _context.WorkflowTemplates.AddRange(templateList);
        _context.SaveChanges();

        // 3. Create 100+ Active Delegations
        var employees = _context.Employees.Take(50).ToList();
        var departments = new[] { "Engineering", "Human Resources", "Finance", "Sales", "Operations", "Marketing", "Legal" };
        var delegations = new List<Delegation>();

        for (int d = 0; d < 120; d++)
        {
            var delegator = employees.Any() ? faker.PickRandom(employees) : null;
            var delegatee = employees.Any() ? faker.PickRandom(employees) : null;
            var start = DateTime.UtcNow.AddDays(-faker.Random.Int(5, 30));
            var end = start.AddDays(faker.Random.Int(7, 45));

            delegations.Add(new Delegation
            {
                DelegatorId = delegator?.Id.ToString() ?? $"emp-del-{d}",
                DelegatorName = delegator != null ? $"{delegator.FirstName} {delegator.LastName}" : faker.Name.FullName(),
                DelegateeId = delegatee?.Id.ToString() ?? $"emp-rep-{d}",
                DelegateeName = delegatee != null ? $"{delegatee.FirstName} {delegatee.LastName}" : faker.Name.FullName(),
                StartDate = start,
                EndDate = end,
                Reason = faker.PickRandom(new[] { "Annual Vacation Leave", "International Conference Travel", "Medical Recovery", "Executive Training Workshop", "Temporary Project Secondment" }),
                Modules = faker.PickRandom(new[] { "All", "Leave", "Attendance", "Payroll", "Recruitment" }),
                IsActive = end >= DateTime.UtcNow,
                CreatedBy = "HR Administration"
            });
        }
        _context.Delegations.AddRange(delegations);
        _context.SaveChanges();

        // 4. Create 1,100+ Realistic Workflow Instances (ApprovalRequests)
        var approvalRequests = new List<ApprovalRequest>();
        var approvalTasks = new List<ApprovalTask>();
        var approvalHistories = new List<ApprovalHistory>();
        var workflowEscalations = new List<WorkflowEscalation>();
        var approvalComments = new List<ApprovalComment>();

        var approverPersonas = new List<(string Id, string Name, string Role, string Dept)>
        {
            ("mgr-01", "David Ross", "Engineering Manager", "Engineering"),
            ("mgr-02", "Eleanor Vance", "VP Operations", "Operations"),
            ("mgr-03", "Marcus Sterling", "Finance Controller", "Finance"),
            ("mgr-04", "Jennifer Vance", "HR Business Partner", "Human Resources"),
            ("mgr-05", "Alexander Wright", "Director of Product", "Engineering"),
            ("mgr-06", "Rachel Green", "Talent Acquisition Head", "Human Resources"),
            ("mgr-07", "Robert Henderson", "Chief Financial Officer", "Finance"),
            ("mgr-08", "Sophia Martinez", "Senior HR Specialist", "Human Resources")
        };

        var statuses = new[] { "Pending", "Approved", "Approved", "Approved", "Rejected", "ChangesRequested", "Escalated" };
        var priorities = new[] { "Low", "Normal", "Normal", "Normal", "High", "Urgent" };

        for (int i = 1; i <= 1100; i++)
        {
            var def = faker.PickRandom(definitions);
            var emp = employees.Any() ? faker.PickRandom(employees) : null;
            var reqName = emp != null ? $"{emp.FirstName} {emp.LastName}" : faker.Name.FullName();
            var reqEmail = emp?.Email ?? faker.Internet.Email();
            var reqDept = faker.PickRandom(departments);
            var status = faker.PickRandom(statuses);
            var priority = faker.PickRandom(priorities);
            var submitted = DateTime.UtcNow.AddDays(-faker.Random.Int(0, 90));
            var amount = def.Module == "Payroll" || def.Module == "Performance" ? (decimal?)faker.Random.Decimal(250, 18500) : null;

            var summary = def.Module switch
            {
                "Leave" => $"Request for {faker.Random.Int(1, 14)} days annual leave ({faker.Date.FutureDateOnly():MMM dd})",
                "Attendance" => $"Regularization for missed check-in on {faker.Date.RecentDateOnly():MMM dd}",
                "Payroll" => $"Expense reimbursement claim for client travel: ${amount:F2}",
                "Recruitment" => $"Headcount requisition for Senior {reqDept} Engineer",
                "Performance" => $"Annual promotion and compensation adjustment (+18%)",
                "Asset" => "High-performance MacBook Pro 16\" developer workstation",
                "Offboarding" => $"Voluntary resignation clearance for {reqName}",
                _ => $"Standard {def.Module} operational request"
            };

            var payload = new Dictionary<string, object>
            {
                ["days"] = faker.Random.Int(1, 12),
                ["amount"] = amount ?? 0,
                ["department"] = reqDept,
                ["reason"] = summary
            };

            var firstStep = def.Steps.OrderBy(s => s.OrderIndex).FirstOrDefault();
            var req = new ApprovalRequest
            {
                RequestNumber = $"REQ-2026-{i:D5}",
                WorkflowDefinitionId = def.Id,
                WorkflowDefinition = def,
                RequesterId = emp?.Id.ToString() ?? $"emp-{i}",
                RequesterName = reqName,
                RequesterEmail = reqEmail,
                Department = reqDept,
                Module = def.Module,
                EntityType = $"{def.Module}Request",
                ReferenceId = Guid.NewGuid().ToString(),
                Status = status,
                Priority = priority,
                CurrentStepIndex = status == "Approved" ? def.Steps.Count : 1,
                CurrentStepId = firstStep?.Id,
                CurrentStepName = firstStep?.StepName ?? "Manager Review",
                Summary = summary,
                Amount = amount,
                PayloadJson = JsonSerializer.Serialize(payload),
                SubmittedAt = submitted,
                DueDate = submitted.AddHours(firstStep?.TimeoutHours ?? 24),
                CompletedAt = (status == "Approved" || status == "Rejected") ? submitted.AddHours(faker.Random.Int(2, 36)) : null,
                SlaStatus = status == "Escalated" ? "Escalated" : (submitted.AddHours(24) < DateTime.UtcNow && status == "Pending" ? "Overdue" : "OnTime"),
                CreatedBy = reqName
            };

            approvalRequests.Add(req);

            // Create Approval Tasks per step
            foreach (var step in def.Steps.OrderBy(s => s.OrderIndex))
            {
                var approver = faker.PickRandom(approverPersonas);
                bool isStepCompleted = (status == "Approved") || (status == "Rejected" && step.OrderIndex == 1);
                var taskStatus = isStepCompleted ? (status == "Approved" ? "Approved" : "Rejected") : (step.OrderIndex == 1 ? (status == "Escalated" ? "Escalated" : "Pending") : "Waiting");

                var task = new ApprovalTask
                {
                    ApprovalRequestId = req.Id,
                    ApprovalRequest = req,
                    WorkflowStepId = step.Id,
                    StepKey = step.StepKey,
                    StepName = step.StepName,
                    OrderIndex = step.OrderIndex,
                    ApproverType = step.ApproverType,
                    AssignedUserId = approver.Id,
                    AssignedUserName = approver.Name,
                    AssignedRoleName = approver.Role,
                    AssignedDepartmentId = approver.Dept,
                    Status = taskStatus,
                    DueDate = submitted.AddHours(step.TimeoutHours),
                    SlaStatus = taskStatus == "Escalated" ? "Escalated" : (submitted.AddHours(step.TimeoutHours) < DateTime.UtcNow && taskStatus == "Pending" ? "Overdue" : "OnTime"),
                    StartedAt = submitted,
                    CompletedAt = isStepCompleted ? submitted.AddHours(faker.Random.Int(2, 28)) : null,
                    ActionTaken = isStepCompleted ? (status == "Approved" ? "Approved" : "Rejected") : string.Empty,
                    ActionTakenByUserId = isStepCompleted ? approver.Id : string.Empty,
                    ActionTakenByName = isStepCompleted ? approver.Name : string.Empty,
                    Comments = isStepCompleted ? (status == "Approved" ? "Reviewed and verified with department schedule." : "Does not meet policy guidelines. Rejected.") : string.Empty,
                    IsDelegated = faker.Random.Bool(0.08f),
                    OriginalApproverName = approver.Name,
                    CreatedBy = "WorkflowEngine"
                };

                approvalTasks.Add(task);

                // Add History
                if (isStepCompleted)
                {
                    approvalHistories.Add(new ApprovalHistory
                    {
                        ApprovalRequestId = req.Id,
                        ApprovalTaskId = task.Id,
                        WorkflowStepId = step.Id,
                        StepName = step.StepName,
                        ActorId = approver.Id,
                        ActorName = approver.Name,
                        ActorRole = approver.Role,
                        Action = task.ActionTaken,
                        PreviousStatus = "Pending",
                        NewStatus = task.ActionTaken,
                        Comments = task.Comments,
                        ActionDate = task.CompletedAt ?? DateTime.UtcNow,
                        CreatedBy = approver.Name
                    });
                }

                // Add Escalation record if applicable
                if (taskStatus == "Escalated" || req.SlaStatus == "Escalated")
                {
                    workflowEscalations.Add(new WorkflowEscalation
                    {
                        ApprovalRequestId = req.Id,
                        ApprovalTaskId = task.Id,
                        OriginalApproverId = approver.Id,
                        OriginalApproverName = approver.Name,
                        EscalatedToUserName = "VP Human Resources (Eleanor Vance)",
                        EscalatedToRole = "HR_Director",
                        EscalationLevel = 1,
                        Reason = "Automated SLA Breach (Overdue > 24 Hours)",
                        EscalatedAt = submitted.AddHours(step.TimeoutHours + 1),
                        SlaBreachHours = faker.Random.Int(4, 36),
                        IsResolved = status == "Approved",
                        CreatedBy = "SystemSlaEngine"
                    });
                }
            }

            // Initial submission history
            approvalHistories.Add(new ApprovalHistory
            {
                ApprovalRequestId = req.Id,
                WorkflowStepId = firstStep?.Id,
                StepName = "Initial Submission",
                ActorId = req.RequesterId,
                ActorName = req.RequesterName,
                ActorRole = "Requester",
                Action = "Submitted",
                PreviousStatus = "Draft",
                NewStatus = "Pending",
                Comments = $"Request submitted: {summary}",
                ActionDate = submitted,
                CreatedBy = req.RequesterName
            });

            // Occasional comment
            if (faker.Random.Bool(0.35f))
            {
                approvalComments.Add(new ApprovalComment
                {
                    ApprovalRequestId = req.Id,
                    UserId = req.RequesterId,
                    UserName = req.RequesterName,
                    UserRole = "Requester",
                    CommentText = "All supporting receipts and documents have been uploaded to the portal.",
                    CreatedAt = submitted.AddMinutes(5),
                    CreatedBy = req.RequesterName
                });
            }
        }

        _context.ApprovalRequests.AddRange(approvalRequests);
        _context.ApprovalTasks.AddRange(approvalTasks);
        _context.ApprovalHistories.AddRange(approvalHistories);
        _context.WorkflowEscalations.AddRange(workflowEscalations);
        _context.ApprovalComments.AddRange(approvalComments);
        _context.SaveChanges();

        Console.WriteLine($"Enterprise Workflow Engine Data Generated Successfully! Created {definitions.Count} Workflows, {allVersions.Count} Versions, {allSteps.Count} Steps, {approvalRequests.Count} Instances, {approvalTasks.Count} Tasks, {delegations.Count} Delegations, and {workflowEscalations.Count} Escalations.");
    }
}
