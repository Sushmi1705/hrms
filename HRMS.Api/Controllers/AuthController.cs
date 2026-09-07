using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Auth;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthController(IMediator mediator) { _mediator = mediator; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var finalCommand = command with { IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown", UserAgent = Request.Headers["User-Agent"].ToString() };
        return Ok(await _mediator.Send(finalCommand));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpCommand command) => Ok(await _mediator.Send(command));

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpCommand command) => Ok(await _mediator.Send(command));

    [HttpGet("me")]
    public async Task<IActionResult> GetMe([FromQuery] Guid userId) => Ok(await _mediator.Send(new GetMeQuery(userId)));
}
