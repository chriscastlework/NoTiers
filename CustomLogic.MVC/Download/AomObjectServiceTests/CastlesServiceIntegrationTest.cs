 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.AomObjectService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.AomObjectServiceTests
{
    [TestClass]
    public class AomObjectServiceTests
    {


        public AomObjectServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public AomObjectViewModel MakeDummyRecord()
        {
            return new AomObjectViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<AomObjectViewModel> _AomObjectService = new AomObjectService(new YourDbContext());


        public Response<AomObjectViewModel> AomObjectResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newAomObjectViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _AomObjectService.Insert(newAomObjectViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _AomObjectService.Insert(new AomObjectViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _AomObjectService.View(new AomObjectViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _AomObjectService.Insert(new AomObjectViewModel()
            {
                Name = "Test AomObject 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _AomObjectService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _AomObjectService.Insert(new AomObjectViewModel()
            {
                Name = "Test AomObject which i will delete"
            }
            , mockUser);

            // Act
            var result = _AomObjectService.Delete(new AomObjectViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _AomObjectService.View(new AomObjectViewModel()
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
            var result = _AomObjectService.List(new NgTableParams
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
