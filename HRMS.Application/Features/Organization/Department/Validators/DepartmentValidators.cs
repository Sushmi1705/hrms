using FluentValidation;
using HRMS.Application.Features.Organization.Department.Commands;

namespace HRMS.Application.Features.Organization.Department.Validators;

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

