using System.Diagnostics;
using System.Linq;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.AccountsService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.Account
{
    [TestClass]
    public class AccountsServiceTests : VrTestBase
    {
        private readonly IService<AccountsViewModel> _accountsService = new AccountService(new VelocityRocketLegacy());
        private readonly string initialilisedAccountName = "Tests";

        [TestInitialize]
        public void Init()
        {
            var insertResult = _accountsService.Insert(new AccountsViewModel { Name = initialilisedAccountName }, null);
        }


        public Response<AccountsViewModel> AccountsResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newAccountsViewModel = new AccountsViewModel() { };


            // Act - send this to the insert method on the account service logic
            var Response = _accountsService.Insert(newAccountsViewModel, null);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _accountsService.Insert(new AccountsViewModel(), null);

            // Act
            var result = _accountsService.View(new AccountsViewModel { Id = result1.Data.Id }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _accountsService.Insert(new AccountsViewModel()
                //{
                //    Title = "Test Accounts 1"
                //}
                , null);

            // Act
            //result2.Data.Title = "Changed";
            var result = _accountsService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            //Assert.IsTrue(result.Data.Title == result2.Data.Title);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _accountsService.Insert(new AccountsViewModel()
                //{
                //    Title = "Test Accounts which i will delete"
                //}
                , null);

            // Act
            var result = _accountsService.Delete(new AccountsViewModel()
                    { Id = result4.Data.Id }
                , null);

            var result2 = _accountsService.View(new AccountsViewModel()
                    { Id = result4.Data.Id }
                , null);

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(!result2.Success);
        }


        [TestMethod]
        public void Query()
        {
            // Arrange - insert a deal so that we have something to edit
          
            object filter = new { Name = initialilisedAccountName };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _accountsService.List(new NgTableParams
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

        [TestMethod]
        public void QueryWithNoParameters()
        {

            // Arrange - insert a deal so that we have something to edit
            object filter = new { Name = "Test" };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _accountsService.List(new NgTableParams(),null);

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