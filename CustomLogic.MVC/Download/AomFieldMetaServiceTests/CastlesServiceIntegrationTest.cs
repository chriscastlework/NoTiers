 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.AomFieldMetaService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.AomFieldMetaServiceTests
{
    [TestClass]
    public class AomFieldMetaServiceTests
    {


        public AomFieldMetaServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public AomFieldMetaViewModel MakeDummyRecord()
        {
            return new AomFieldMetaViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<AomFieldMetaViewModel> _AomFieldMetaService = new AomFieldMetaService(new YourDbContext());


        public Response<AomFieldMetaViewModel> AomFieldMetaResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newAomFieldMetaViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _AomFieldMetaService.Insert(newAomFieldMetaViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _AomFieldMetaService.Insert(new AomFieldMetaViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _AomFieldMetaService.View(new AomFieldMetaViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _AomFieldMetaService.Insert(new AomFieldMetaViewModel()
            {
                Name = "Test AomFieldMeta 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _AomFieldMetaService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _AomFieldMetaService.Insert(new AomFieldMetaViewModel()
            {
                Name = "Test AomFieldMeta which i will delete"
            }
            , mockUser);

            // Act
            var result = _AomFieldMetaService.Delete(new AomFieldMetaViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _AomFieldMetaService.View(new AomFieldMetaViewModel()
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
            var result = _AomFieldMetaService.List(new NgTableParams
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
