using System.Diagnostics;
using System.Linq;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.DealsService;
using CustomLogic.UmbracoApis;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.Deals
{
    [TestClass]
    public class DealsServiceTests : VrTestBase
    {
        private readonly IService<DealsViewModel> _DealsService = new DealService(new VelocityRocketLegacy());


        public DealsServiceTests()
        {
            mockUser = new CoreUser
            {
                UserId = "b9dd9a67-dcc5-437a-a9e3-335bfdfc456a",
                OrgId = 168,
                IsTestMode = true,
                IsGlobalPermissions = false,
                OrgAdmin = false,
                StcAdmin = false,
                WsAdmin = false,
                IsManager = false,
            };
        }

        public Response<DealsViewModel> DealsResponse { get; set; }

        private ICoreUser mockUser;



        [TestMethod]
        public void MangerNeededForDealOver10()
        {
            // Arrange - Create a new account view model
            var newDealsViewModel = new DealsViewModel() { Name = "Chris" , RevenueAmount = 11};


            // Act - send this to the insert method on the account service logic
            var Response = _DealsService.Insert(newDealsViewModel, mockUser);


            // Assert
            Assert.IsTrue(!Response.Success);
            // Assert.IsTrue(Response.Messages.Any(c=>c.MessageText == "Name is required"));

        }

        [TestMethod]
        public void MangerCanAddADealOver10()
        {
            // Arrange - Create a new account view model
            var newDealsViewModel = new DealsViewModel() { Name = "Chris", RevenueAmount = 11 };
            mockUser.IsManager = true;


            // Act - send this to the insert method on the account service logic
            var Response = _DealsService.Insert(newDealsViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);
            // Assert.IsTrue(Response.Messages.Any(c=>c.MessageText == "Name is required"));

        }



        [TestMethod]
        public void NameRequired()
        {
            // Arrange - Create a new account view model
            var newDealsViewModel = new DealsViewModel() { Name = "Chris"};


            // Act - send this to the insert method on the account service logic
            var Response = _DealsService.Insert(newDealsViewModel, null);


            // Assert
            Assert.IsTrue(Response.Success);
           // Assert.IsTrue(Response.Messages.Any(c=>c.MessageText == "Name is required"));

        }


        [TestMethod]
        public void ViewAndUpdate()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _DealsService.Insert(new DealsViewModel(), null);

            // Act
            var result = _DealsService.View(new DealsViewModel { Id = result1.Data.Id }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }


        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _DealsService.Insert(new DealsViewModel(), null);

            // Act
            var result = _DealsService.View(new DealsViewModel { Id = result1.Data.Id }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _DealsService.Insert(new DealsViewModel()
                //{
                //    Title = "Test Deals 1"
                //}
                , null);

            // Act
            result2.Data.Name = "Changed";
            var result = _DealsService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _DealsService.Insert(new DealsViewModel()
                //{
                //    Title = "Test Deals which i will delete"
                //}
                , null);

            // Act
            var result = _DealsService.Delete(new DealsViewModel()
                 { Id = result4.Data.Id }
                , null);

            var result2 = _DealsService.View(new DealsViewModel()
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
            object filter = new { Id = "1" };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _DealsService.List( new NgTableParams
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