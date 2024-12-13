namespace Saitynai.Auth.Model
{
    public class GymRoles
    {
        public const string Admin = nameof(Admin);
        public const string GymUser = nameof(GymUser);

        public static readonly IReadOnlyCollection<string> All = new[] { Admin, GymUser };
    }
}
