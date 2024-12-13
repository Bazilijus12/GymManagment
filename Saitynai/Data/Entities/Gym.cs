using Saitynai.Auth.Model;
using System.ComponentModel.DataAnnotations;

namespace Saitynai.Data.Entities
{
    public class Gym
    {
        public int Id { get; set; }

        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string City { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Email { get; set; }
        public required int Capacity { get; set; }
        [Required]
        public required string UserId { get; set; }
        public GymUser User { get; set; }

        public GymDTO ToDto()
        {
            return new GymDTO(Id, Name, Address, City, PhoneNumber,Email,Capacity);
        }
    }
}
