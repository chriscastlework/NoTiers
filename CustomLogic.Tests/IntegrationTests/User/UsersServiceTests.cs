using System.Diagnostics;
using System.Linq;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.UsersService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.User
{
    [TestClass]
    public class UsersServiceTests
    {
        private readonly IService<UsersViewModel> _usersService = new UserService(new VelocityRocketLegacy());


        public Response<UsersViewModel> UsersResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newUsersViewModel = new UsersViewModel() { };


            // Act - send this to the insert method on the account service logic
            var Response = _usersService.Insert(newUsersViewModel, null);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _usersService.Insert(new UsersViewModel(), null);

            // Act
            var result = _usersService.View(new UsersViewModel { UserId = result1.Data.UserId }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _usersService.Insert(new UsersViewModel()
            //{
            //    Title = "Test Users 1"
            //}
            , null);

            // Act
            //result2.Data.Title = "Changed";
            var result = _usersService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            //Assert.IsTrue(result.Data.Title == result2.Data.Title);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _usersService.Insert(new UsersViewModel()
            //{
            //    Title = "Test Users which i will delete"
            //}
            , null);

            // Act
            var result = _usersService.Delete(new UsersViewModel()
            { UserId = result4.Data.UserId }
            , null);

            var result2 = _usersService.View(new UsersViewModel()
            { UserId = result4.Data.UserId }
            , null);

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(!result2.Success);
        }


        [TestMethod]
        public void Query()
        {

            // Arrange - insert a deal so that we have something to edit
            object filter = new { Id = "1" };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _usersService.List(new NgTableParams
            {
                filter = JsonConvert.SerializeObject(filter)
            },null);

#if DEBUG
            sw.Stop();
            var totalTime = sw.Elapsed.Seconds;
#endif

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Any());

        }

    }
}
