 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.ContainerAlertsService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.ContainerAlertsServiceTests
{
    [TestClass]
    public class ContainerAlertsServiceTests
    {


        public ContainerAlertsServiceTests()
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

        private readonly IService<ContainerAlertsViewModel> _ContainerAlertsService = new ContainerAlertsService(new YourDbContext());


        public Response<ContainerAlertsViewModel> ContainerAlertsResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newContainerAlertsViewModel = new ContainerAlertsViewModel() {
Name = "Test Name"
};


            // Act - send this to the insert method on the account service logic
            var Response = _ContainerAlertsService.Insert(newContainerAlertsViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _ContainerAlertsService.Insert(new ContainerAlertsViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _ContainerAlertsService.View(new ContainerAlertsViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _ContainerAlertsService.Insert(new ContainerAlertsViewModel()
            {
                Name = "Test ContainerAlerts 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _ContainerAlertsService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _ContainerAlertsService.Insert(new ContainerAlertsViewModel()
            {
                Name = "Test ContainerAlerts which i will delete"
            }
            , mockUser);

            // Act
            var result = _ContainerAlertsService.Delete(new ContainerAlertsViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _ContainerAlertsService.View(new ContainerAlertsViewModel()
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
            var result = _ContainerAlertsService.List(new NgTableParams
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
