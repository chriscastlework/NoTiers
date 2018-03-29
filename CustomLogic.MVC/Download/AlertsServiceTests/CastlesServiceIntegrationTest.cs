 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.AlertsService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.AlertsServiceTests
{
    [TestClass]
    public class AlertsServiceTests
    {


        public AlertsServiceTests()
        {
           // The default mock user
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

        private ICoreUser mockUser;

        private readonly IService<AlertsViewModel> _AlertsService = new AlertsService(new YourDbContext());


        public Response<AlertsViewModel> AlertsResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newAlertsViewModel = new AlertsViewModel() {
Name = "Test Name"
};


            // Act - send this to the insert method on the account service logic
            var Response = _AlertsService.Insert(newAlertsViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _AlertsService.Insert(new AlertsViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _AlertsService.View(new AlertsViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _AlertsService.Insert(new AlertsViewModel()
            {
                Name = "Test Alerts 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _AlertsService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _AlertsService.Insert(new AlertsViewModel()
            {
                Name = "Test Alerts which i will delete"
            }
            , mockUser);

            // Act
            var result = _AlertsService.Delete(new AlertsViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _AlertsService.View(new AlertsViewModel()
             { Id = result4.Data.Id }
            , mockUser);

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
            var result = _AlertsService.List(new NgTableParams
            {
                filter = JsonConvert.SerializeObject(filter)
            }, mockUser);

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
