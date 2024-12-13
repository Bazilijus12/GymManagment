using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Saitynai.Auth.Model;
using Saitynai.Data;
using Saitynai.Data.Entities;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Saitynai;

public static class Endpoints
{
    public static void AddGymApi(this WebApplication app)
    {
        var gymsGroup = app.MapGroup("/api/gyms").AddFluentValidationAutoValidation();

        gymsGroup.MapGet("/", async (ForumDbContext dbContext) =>
        {
            var gyms = await dbContext.Gyms.ToListAsync();
            return Results.Ok(gyms.Select(gym => gym.ToDto()));
        });

        gymsGroup.MapGet("/{gymId}", async (int gymId, ForumDbContext dbContext) =>
        {
            var gym = await dbContext.Gyms.FindAsync(gymId);
            return gym == null ? Results.NotFound() : Results.Ok(gym.ToDto());
        });

        gymsGroup.MapPost("/", [Authorize(Roles = GymRoles.Admin)] async ([FromBody] CreateGymDTO dto, HttpContext httpContext, ForumDbContext dbContext) =>
        {
            var gym = new Gym
            {
                Name = dto.Name,
                Address = dto.Address,
                City = dto.City,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Capacity = dto.Capacity,
                UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };
            dbContext.Gyms.Add(gym);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/api/gyms/{gym.Id}", gym.ToDto());
        });

        gymsGroup.MapPut("/{gymId}", [Authorize(Roles = GymRoles.Admin)] async (UpdateGymDTO dto, int gymId, HttpContext httpContext, ForumDbContext dbContext) =>
        {
            var gym = await dbContext.Gyms.FindAsync(gymId);
            if (gym == null) return Results.NotFound();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!httpContext.User.IsInRole(GymRoles.Admin) && currentUserId != gym.UserId)
            {
                return Results.Forbid();
            }

            gym.Name = dto.Name;
            dbContext.Gyms.Update(gym);
            await dbContext.SaveChangesAsync();
            return Results.Ok(gym.ToDto());
        });


        gymsGroup.MapDelete("/{gymId}", [Authorize(Roles = GymRoles.Admin)] async (int gymId, HttpContext httpContext, ForumDbContext dbContext) =>
        {
            var gym = await dbContext.Gyms.FindAsync(gymId);
            if (gym == null) return Results.NotFound();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!httpContext.User.IsInRole(GymRoles.Admin) && currentUserId != gym.UserId)
            {
                return Results.Forbid();
            }

            dbContext.Gyms.Remove(gym);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    public static void AddWorkoutApi(this WebApplication app)
    {
        var workoutsGroup = app.MapGroup("/api/gyms/{gymId}/workouts").AddFluentValidationAutoValidation();


        workoutsGroup.MapGet("/", async (int gymId, ForumDbContext dbContext) =>
        {
            var gymExists = await dbContext.Gyms.AnyAsync(g => g.Id == gymId);
            if (!gymExists) return Results.NotFound();

            var workouts = await dbContext.Workouts
                .Where(w => w.Gym.Id == gymId)
                .ToListAsync();

            return Results.Ok(workouts.Select(workout => workout.ToDto()));
        });

        workoutsGroup.MapGet("/{workoutId}", async (int workoutId, int gymId, ForumDbContext dbContext) =>
        {
            var workout = await dbContext.Workouts
                .Where(w => w.Id == workoutId && w.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            return workout == null ? Results.NotFound() : Results.Ok(workout.ToDto());
        });

        
        workoutsGroup.MapPost("/", [Authorize(Roles = GymRoles.GymUser)] async (int gymId, CreateWorkoutDTO workoutDto, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var gym = await dbContext.Gyms.FindAsync(gymId);
            if (gym == null) return Results.NotFound();

            var workout = new Workout
            {
                Name = workoutDto.Name,
                Description = workoutDto.Description,
                Duration = workoutDto.Duration,
                WorkoutDate = workoutDto.WorkoutDate,
                Difficulty = workoutDto.Difficulty,
                CaloriesBurned = workoutDto.CaloriesBurned,
                Type = workoutDto.Type,
                MaxParticipants = workoutDto.MaxParticipants,
                Gym = gym,
                UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            dbContext.Workouts.Add(workout);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/api/gyms/{gymId}/workouts/{workout.Id}", workout.ToDto());
        });

        workoutsGroup.MapGet("/ended", async (int gymId, ForumDbContext dbContext) =>
        {
            var gymExists = await dbContext.Gyms.AnyAsync(g => g.Id == gymId);
            if (!gymExists) return Results.NotFound();

            var endedWorkouts = await dbContext.Workouts
                .Where(w => w.Gym.Id == gymId && w.WorkoutDate < DateTime.UtcNow)
                .ToListAsync();

            return Results.Ok(endedWorkouts.Select(workout => workout.ToDto()));
        });


        workoutsGroup.MapPut("/{workoutId}", [Authorize(Roles = GymRoles.GymUser)] async (int gymId, int workoutId, UpdateWorkoutDTO dto, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var workout = await dbContext.Workouts
                .Where(w => w.Id == workoutId && w.Gym.Id == gymId)
            .FirstOrDefaultAsync();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!httpContext.User.IsInRole(GymRoles.Admin) && currentUserId != workout.UserId)
            {
                return Results.Forbid();
            }

            if (workout == null) return Results.NotFound();

            workout.Description = dto.Description;

            dbContext.Workouts.Update(workout);
            await dbContext.SaveChangesAsync();
            return Results.Ok(workout.ToDto());
        });

        workoutsGroup.MapDelete("/{workoutId}", [Authorize(Roles = GymRoles.Admin + "," + GymRoles.GymUser)] async (int workoutId, int gymId, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var workout = await dbContext.Workouts
                .Where(w => w.Id == workoutId && w.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            if (workout == null) return Results.NotFound();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!httpContext.User.IsInRole(GymRoles.Admin) && currentUserId != workout.UserId)
            {
                return Results.Forbid();
            }

            dbContext.Workouts.Remove(workout);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    public static void AddReviewApi(this WebApplication app)
    {
        var reviewsGroup = app.MapGroup("/api/gyms/{gymId}/workouts/{workoutId}/reviews").AddFluentValidationAutoValidation();

        reviewsGroup.MapGet("/",  async (int gymId, int workoutId, ForumDbContext dbContext) =>
        {
            var workoutExists = await dbContext.Workouts.AnyAsync(w => w.Id == workoutId && w.Gym.Id == gymId);
            if (!workoutExists) return Results.NotFound();

            var reviews = await dbContext.Reviews
                .Where(r => r.Workout.Id == workoutId && r.Workout.Gym.Id == gymId)
                .ToListAsync();

            return Results.Ok(reviews.Select(review => review.ToDto()));
        });


        reviewsGroup.MapGet("/{reviewId}",  async (int reviewId, int gymId, int workoutId, ForumDbContext dbContext) =>
        {
            var review = await dbContext.Reviews
                .Where(r => r.Id == reviewId && r.Workout.Id == workoutId && r.Workout.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            return review == null ? Results.NotFound() : Results.Ok(review.ToDto());
        });


        reviewsGroup.MapPost("/", [Authorize] async (int gymId, int workoutId, CreateReviewDTO reviewDto, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var workout = await dbContext.Workouts
                .Where(w => w.Id == workoutId && w.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            if (workout == null) return Results.NotFound();

            var review = new Review
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                ReviewDate = reviewDto.ReviewDate,
                Workout = workout,
                UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            dbContext.Reviews.Add(review);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/api/gyms/{gymId}/workouts/{workoutId}/reviews/{review.Id}", review.ToDto());
        });


        reviewsGroup.MapPut("/{reviewId}", [Authorize] async (int reviewId, int gymId, int workoutId, UpdateReviewDTO dto, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var review = await dbContext.Reviews
                .Where(r => r.Id == reviewId && r.Workout.Id == workoutId && r.Workout.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            if (review == null) return Results.NotFound();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (currentUserId != review.UserId)
            {
                return Results.Forbid();
            }

            review.Comment = dto.Comment;
            dbContext.Reviews.Update(review);
            await dbContext.SaveChangesAsync();

            return Results.Ok(review.ToDto());
        });

        reviewsGroup.MapDelete("/{reviewId}", [Authorize(Roles = GymRoles.GymUser + "," + GymRoles.Admin)] async (int reviewId, int gymId, int workoutId, ForumDbContext dbContext, HttpContext httpContext) =>
        {
            var review = await dbContext.Reviews
                .Where(r => r.Id == reviewId && r.Workout.Id == workoutId && r.Workout.Gym.Id == gymId)
                .FirstOrDefaultAsync();

            if (review == null) return Results.NotFound();

            var currentUserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (currentUserId != review.UserId && !httpContext.User.IsInRole(GymRoles.Admin))
            {
                return Results.Forbid();
            }

            dbContext.Reviews.Remove(review);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
