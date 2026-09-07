using FluentValidation;
using HRMS.Application.Features.Organization.JobGrade.Commands;

namespace HRMS.Application.Features.Organization.JobGrade.Validators;

public class CreateJobGradeCommandValidator : AbstractValidator<CreateJobGradeCommand>
{
    public CreateJobGradeCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

