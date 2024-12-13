using Saitynai.Auth.Model;
using System.ComponentModel.DataAnnotations;

namespace Saitynai.Data.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTimeOffset ReviewDate { get; set; } = DateTime.Now;

        [Required]
        public required string UserId { get; set; }
        public GymUser User { get; set; }

        public required Workout Workout { get; set; }
        public ReviewDTO ToDto()
        {
            return new ReviewDTO(Id, Rating, Comment, ReviewDate);
        }

    }
}