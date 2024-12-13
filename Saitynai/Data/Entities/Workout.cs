using Saitynai.Auth.Model;
using System.ComponentModel.DataAnnotations;

namespace Saitynai.Data.Entities
{
    public class Workout
    {

        public int Id { get; set;}

        public string Name { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public DateTime WorkoutDate { get; set; }
        public string Difficulty { get; set; }
        public int CaloriesBurned { get; set; }
        public string Type { get; set; }
        public int MaxParticipants { get; set; }
        [Required]
        public required string UserId { get; set; }
        public GymUser User { get; set; }

        public required Gym Gym { get; set; }

        public WorkoutDTO ToDto()
        {
            return new WorkoutDTO(Id, Name, Description, Duration, WorkoutDate, Difficulty, CaloriesBurned, Type, MaxParticipants);
        }

    }
}
