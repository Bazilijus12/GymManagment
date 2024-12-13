using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Xml.Linq;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Saitynai;
using Saitynai.Auth;
using Saitynai.Auth.Model;
using Saitynai.Data;
using Saitynai.Data.Entities;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Results;
using SharpGrip.FluentValidation.AutoValidation.Shared.Extensions;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ForumDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddScoped<AuthSeeder>();
builder.Services.AddScoped<SessionService>();


builder.Services.AddIdentity<GymUser, IdentityRole>()
    .AddEntityFrameworkStores<ForumDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Authorization");
    });
});

builder.Services.AddAuthorization();

var app = builder.Build();

using var scope = app.Services.CreateScope();


var dbContext = scope.ServiceProvider.GetRequiredService<ForumDbContext>();
dbContext.Database.Migrate();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthSeeder>();
await dbSeeder.SeedAsync();
app.AddAuthApi();


app.AddGymApi();
app.AddWorkoutApi();
app.AddReviewApi();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors();

app.Run();

public class ProblemDetailsResultFactory : IFluentValidationAutoValidationResultFactory
{
    public IResult CreateResult(EndpointFilterInvocationContext context, ValidationResult validationResult)
    {
        var problemDetails = new HttpValidationProblemDetails(validationResult.ToValidationProblemErrors())
        {
            Type = "https://tools.ietf.org/html/rfc4918#section-11.2",
            Title = "Unprocessable Entity",
            Status = 422
        };

        return TypedResults.Problem(problemDetails);
    }

}

public record GymDTO(int Id, string Name, string Address, string City, string PhoneNumber, string Email, int Capacity);

public record WorkoutDTO(int Id, string Name, string Description, int Duration, DateTime WorkoutDate, string Difficulty, int CaloriesBurned, string Type, int MaxParticipants);
public record ReviewDTO(int Id, int Rating, string Comment, DateTimeOffset ReviewDate);
public record CreateGymDTO(string Name, string Address, string City, string PhoneNumber, string Email, int Capacity)
{
    public class CreateGymDTOValidator : AbstractValidator<CreateGymDTO>
    {
        public CreateGymDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .Length(min: 2, max: 50)
                .WithMessage("Name must be between 2 and 50 characters.");

            RuleFor(x => x.Address)
                .NotEmpty()
                .Length(min: 2, max: 100)
                .WithMessage("Address must be between 2 and 100 characters.");

            RuleFor(x => x.City)
                .NotEmpty()
                .Length(min: 2, max: 50)
                .WithMessage("City must be between 2 and 50 characters.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^\+?[1-9]\d{1,14}$") // Basic phone number validation
                .WithMessage("Phone number must be valid.");

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .WithMessage("Email must be a valid email address.");

            RuleFor(x => x.Capacity)
                .GreaterThan(0)
                .WithMessage("Capacity must be greater than 0.");
        }
    }
}
public record CreateWorkoutDTO(string Name, string Description, int Duration, DateTime WorkoutDate, string Difficulty, int CaloriesBurned, string Type, int MaxParticipants)
{
    public class CreateWorkoutDTOValidator : AbstractValidator<CreateWorkoutDTO>
    {
        public CreateWorkoutDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .Length(2, 50)
                .WithMessage("Workout name must be between 2 and 50 characters.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .Length(2, 100)
                .WithMessage("Description must be between 2 and 100 characters.");

            RuleFor(x => x.Duration)
                .GreaterThan(0)
                .WithMessage("Duration must be a positive number.");

            RuleFor(x => x.WorkoutDate)
                .NotEmpty()
                .GreaterThan(DateTime.Now)
                .WithMessage("Workout date must be in the future.");

            RuleFor(x => x.Difficulty)
                .NotEmpty()
                .WithMessage("Difficulty is required.");

            RuleFor(x => x.CaloriesBurned)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Calories burned must be a non-negative number.");

            RuleFor(x => x.Type)
                .NotEmpty()
                .Length(2, 50)
                .WithMessage("Type must be between 2 and 50 characters.");

            RuleFor(x => x.MaxParticipants)
                .GreaterThan(0)
                .WithMessage("Max participants must be a positive number.");
        }
    }
}

public record CreateReviewDTO(int Rating, string Comment, DateTimeOffset ReviewDate)
{
    public class CreateReviewDTOValidator : AbstractValidator<CreateReviewDTO>
    {
        public CreateReviewDTOValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5.");

            RuleFor(x => x.Comment)
                .NotEmpty()
                .Length(2, 250)
                .WithMessage("Comment must be between 2 and 250 characters.");

            RuleFor(x => x.ReviewDate)
                .NotEmpty()
                .LessThanOrEqualTo(DateTimeOffset.Now)
                .WithMessage("Review date cannot be in the future.");
        }
    }
}
public record UpdateGymDTO(string Name)
{
    public class UpdateGymDTOValidator : AbstractValidator<UpdateGymDTO>
    {
        public UpdateGymDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .Length(2, 50)
                .WithMessage("Gym name must be between 2 and 50 characters.");
        }
    }
}

public record UpdateWorkoutDTO(string Description)
{
    public class UpdateWorkoutDTOValidator : AbstractValidator<UpdateWorkoutDTO>
    {
        public UpdateWorkoutDTOValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty()
                .Length(2, 100)
                .WithMessage("Description must be between 2 and 100 characters.");
        }
    }
}



public record UpdateReviewDTO(string Comment)
{
    public class UpdateReviewDTOValidator : AbstractValidator<UpdateReviewDTO>
    {
        public UpdateReviewDTOValidator()
        {
            RuleFor(x => x.Comment)
                .NotEmpty()
                .Length(2, 250)
                .WithMessage("Comment must be between 2 and 250 characters.");
        }
    }
}