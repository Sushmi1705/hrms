using FluentValidation;
using HRMS.Application.Features.Organization.Location.Commands;

namespace HRMS.Application.Features.Organization.Location.Validators;

public class CreateLocationCommandValidator : AbstractValidator<CreateLocationCommand>
{
    public CreateLocationCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

