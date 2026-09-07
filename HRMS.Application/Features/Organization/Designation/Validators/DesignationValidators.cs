using FluentValidation;
using HRMS.Application.Features.Organization.Designation.Commands;

namespace HRMS.Application.Features.Organization.Designation.Validators;

public class CreateDesignationCommandValidator : AbstractValidator<CreateDesignationCommand>
{
    public CreateDesignationCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

