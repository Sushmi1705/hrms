using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class AssessmentQuestion : BaseAuditableEntity
{
    public Guid AssessmentId { get; set; }
    public string QuestionType { get; set; } = "MCQ"; // MCQ, TrueFalse, Essay
    public string QuestionText { get; set; } = string.Empty;
    public string OptionsJson { get; set; } = string.Empty;
    public string CorrectOption { get; set; } = string.Empty;
}

