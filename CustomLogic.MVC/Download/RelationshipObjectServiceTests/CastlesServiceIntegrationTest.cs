 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.RelationshipObjectService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.RelationshipObjectServiceTests
{
    [TestClass]
    public class RelationshipObjectServiceTests
    {


        public RelationshipObjectServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public RelationshipObjectViewModel MakeDummyRecord()
        {
            return new RelationshipObjectViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<RelationshipObjectViewModel> _RelationshipObjectService = new RelationshipObjectService(new YourDbContext());


        public Response<RelationshipObjectViewModel> RelationshipObjectResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newRelationshipObjectViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _RelationshipObjectService.Insert(newRelationshipObjectViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _RelationshipObjectService.Insert(new RelationshipObjectViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _RelationshipObjectService.View(new RelationshipObjectViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _RelationshipObjectService.Insert(new RelationshipObjectViewModel()
            {
                Name = "Test RelationshipObject 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _RelationshipObjectService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _RelationshipObjectService.Insert(new RelationshipObjectViewModel()
            {
                Name = "Test RelationshipObject which i will delete"
            }
            , mockUser);

            // Act
            var result = _RelationshipObjectService.Delete(new RelationshipObjectViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _RelationshipObjectService.View(new RelationshipObjectViewModel()
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
            var result = _RelationshipObjectService.List(new NgTableParams
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
