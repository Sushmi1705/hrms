using FluentValidation;
using HRMS.Application.Features.Organization.CostCenter.Commands;

namespace HRMS.Application.Features.Organization.CostCenter.Validators;

public class CreateCostCenterCommandValidator : AbstractValidator<CreateCostCenterCommand>
{
    public CreateCostCenterCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

