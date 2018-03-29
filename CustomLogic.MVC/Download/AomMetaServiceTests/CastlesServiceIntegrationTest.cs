 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.AomMetaService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.AomMetaServiceTests
{
    [TestClass]
    public class AomMetaServiceTests
    {


        public AomMetaServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public AomMetaViewModel MakeDummyRecord()
        {
            return new AomMetaViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<AomMetaViewModel> _AomMetaService = new AomMetaService(new YourDbContext());


        public Response<AomMetaViewModel> AomMetaResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newAomMetaViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _AomMetaService.Insert(newAomMetaViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _AomMetaService.Insert(new AomMetaViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _AomMetaService.View(new AomMetaViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _AomMetaService.Insert(new AomMetaViewModel()
            {
                Name = "Test AomMeta 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _AomMetaService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _AomMetaService.Insert(new AomMetaViewModel()
            {
                Name = "Test AomMeta which i will delete"
            }
            , mockUser);

            // Act
            var result = _AomMetaService.Delete(new AomMetaViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _AomMetaService.View(new AomMetaViewModel()
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
            var result = _AomMetaService.List(new NgTableParams
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
