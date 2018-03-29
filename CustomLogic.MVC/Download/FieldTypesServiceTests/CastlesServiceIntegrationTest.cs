 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.FieldTypesService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.FieldTypesServiceTests
{
    [TestClass]
    public class FieldTypesServiceTests
    {


        public FieldTypesServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public FieldTypesViewModel MakeDummyRecord()
        {
            return new FieldTypesViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<FieldTypesViewModel> _FieldTypesService = new FieldTypesService(new YourDbContext());


        public Response<FieldTypesViewModel> FieldTypesResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newFieldTypesViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _FieldTypesService.Insert(newFieldTypesViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _FieldTypesService.Insert(new FieldTypesViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _FieldTypesService.View(new FieldTypesViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _FieldTypesService.Insert(new FieldTypesViewModel()
            {
                Name = "Test FieldTypes 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _FieldTypesService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _FieldTypesService.Insert(new FieldTypesViewModel()
            {
                Name = "Test FieldTypes which i will delete"
            }
            , mockUser);

            // Act
            var result = _FieldTypesService.Delete(new FieldTypesViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _FieldTypesService.View(new FieldTypesViewModel()
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
            var result = _FieldTypesService.List(new NgTableParams
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
