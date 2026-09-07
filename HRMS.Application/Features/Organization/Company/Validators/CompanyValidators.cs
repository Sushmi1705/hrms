using FluentValidation;
using HRMS.Application.Features.Organization.Company.Commands;

namespace HRMS.Application.Features.Organization.Company.Validators;

public class CreateCompanyCommandValidator : AbstractValidator<CreateCompanyCommand>
{
    public CreateCompanyCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

