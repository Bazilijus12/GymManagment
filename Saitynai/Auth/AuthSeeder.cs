using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Saitynai.Auth.Model;

namespace Saitynai.Auth
{
    public class AuthSeeder
    {
        private readonly UserManager<GymUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AuthSeeder(UserManager<GymUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task SeedAsync()
        {
            await AddDefaultRolesAsync();
            await AddAdminUserAsync();
        }

        private async Task AddDefaultRolesAsync()
        {
            foreach (var role in GymRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private async Task AddAdminUserAsync()
        {
            var newAdminUser = new GymUser()
            {
                UserName = "admin",
                Email = "admin@admin.com",
            };

            var existingAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (existingAdminUser == null)
            {
                var createdAdminUserResult = await _userManager.CreateAsync(newAdminUser, "VerySafePassword!1");
                if (createdAdminUserResult.Succeeded) 
                {
                    await _userManager.AddToRolesAsync(newAdminUser, GymRoles.All);               
                }

            }

        }
    }
}
