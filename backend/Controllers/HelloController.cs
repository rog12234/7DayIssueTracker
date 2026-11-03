using Microsoft.AspNetCore.Mvc;

namespace MunicipalIssueTracker.Api.Controllers;

[ApiController] //identifies the class as a Web API controller
[Route("api/[controller]")] //creates a route based on the name of the controller
public class HelloController : ControllerBase //ControllerBase, provides useful methods for HHTP responses
{
    [HttpGet]
    public IActionResult Get() //IActionResult, represents an HTTP response
    {
        return Ok(new //Ok, returns HTTP 200 with data serialized as JSON
        {
            message = "Hello from ASP.NET Core!",
            project = "Municipal Issue Tracker"
        });
    }
}