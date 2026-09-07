using FluentValidation;
using HRMS.Application.Features.Organization.Branch.Commands;

namespace HRMS.Application.Features.Organization.Branch.Validators;

public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
{
    public CreateBranchCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

