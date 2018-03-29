 using System.Diagnostics;
using System.Linq;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Models;
 using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLogic.Services.RelationshipMetaService;
 using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.RelationshipMetaServiceTests
{
    [TestClass]
    public class RelationshipMetaServiceTests
    {


        public RelationshipMetaServiceTests()
        {
           // The default mock user
            mockUser = new CoreUser
            {
               
            };
        }

        public RelationshipMetaViewModel MakeDummyRecord()
        {
            return new RelationshipMetaViewModel() {
                                                                    Name = "Test Name" // how do we know it has a name 
                                                                 }
        }

        private ICoreUser mockUser;

        private readonly IService<RelationshipMetaViewModel> _RelationshipMetaService = new RelationshipMetaService(new YourDbContext());


        public Response<RelationshipMetaViewModel> RelationshipMetaResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newRelationshipMetaViewModel = ;


            // Act - send this to the insert method on the account service logic
            var Response = _RelationshipMetaService.Insert(newRelationshipMetaViewModel, mockUser);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _RelationshipMetaService.Insert(new RelationshipMetaViewModel(){Name = "Test view Name"}, mockUser);

            // Act
            var result = _RelationshipMetaService.View(new RelationshipMetaViewModel { Id = result1.Data.Id } , mockUser);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _RelationshipMetaService.Insert(new RelationshipMetaViewModel()
            {
                Name = "Test RelationshipMeta 1"
            }
            , mockUser);

            // Act
            result2.Data.Name = "Changed name";
            var result = _RelationshipMetaService.Update(result2.Data, mockUser);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _RelationshipMetaService.Insert(new RelationshipMetaViewModel()
            {
                Name = "Test RelationshipMeta which i will delete"
            }
            , mockUser);

            // Act
            var result = _RelationshipMetaService.Delete(new RelationshipMetaViewModel() 
             { Id = result4.Data.Id }
            , mockUser);

            var result2 = _RelationshipMetaService.View(new RelationshipMetaViewModel()
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
            var result = _RelationshipMetaService.List(new NgTableParams
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
