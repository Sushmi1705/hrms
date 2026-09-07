using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;
using System.Linq;

namespace HRMS.Application.Features.Shift.Queries;

public class GetAllShiftsQuery : IRequest<List<ShiftMasterDto>> { }

public class GetAllShiftsQueryHandler : IRequestHandler<GetAllShiftsQuery, List<ShiftMasterDto>>
{
    private readonly IShiftRepository _shiftRepository;

    public GetAllShiftsQueryHandler(IShiftRepository shiftRepository)
    {
        _shiftRepository = shiftRepository;
    }

    public async Task<List<ShiftMasterDto>> Handle(GetAllShiftsQuery request, CancellationToken cancellationToken)
    {
        var shifts = await _shiftRepository.GetAllShiftsAsync();
        
        return shifts.Select(s => new ShiftMasterDto
        {
            Id = s.Id,
            ShiftName = s.ShiftName,
            ShiftCode = s.ShiftCode,
            ShiftType = s.ShiftType,
            StartTime = s.StartTime.ToString(@"hh\:mm"),
            EndTime = s.EndTime.ToString(@"hh\:mm"),
            WorkingHours = s.WorkingHours,
            ColorCode = s.ColorCode,
            Status = s.Status
        }).ToList();
    }
}
