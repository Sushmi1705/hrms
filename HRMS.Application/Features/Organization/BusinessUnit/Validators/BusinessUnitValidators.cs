using FluentValidation;
using HRMS.Application.Features.Organization.BusinessUnit.Commands;

namespace HRMS.Application.Features.Organization.BusinessUnit.Validators;

public class CreateBusinessUnitCommandValidator : AbstractValidator<CreateBusinessUnitCommand>
{
    public CreateBusinessUnitCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

