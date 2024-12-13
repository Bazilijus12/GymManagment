using Saitynai.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Saitynai.Auth.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
//using Microsoft.AspNet.Identity.EntityFramework;

namespace Saitynai.Data
{
    public class ForumDbContext : IdentityDbContext<GymUser>
    {
        private readonly IConfiguration _configuration;
        
        public DbSet<Gym> Gyms { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Session> Sessions { get; set; }

        public ForumDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("PostgreSQL"));
        }
    }
}
