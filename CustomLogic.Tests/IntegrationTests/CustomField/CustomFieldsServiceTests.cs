using System.Diagnostics;
using System.Linq;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldsService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.CustomField
{
    [TestClass]
    public class CustomFieldsServiceTests : VrTestBase
    {
        private readonly IService<CustomFieldsViewModel> _customFieldsService = new CustomFieldService(new VelocityRocketLegacy());
        private const int requiredOrganisationId = 18;

        public Response<CustomFieldsViewModel> CustomFieldsResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newCustomFieldsViewModel = new CustomFieldsViewModel()
            {
                OrganisationId = requiredOrganisationId,
                FieldType = 1
            };


            // Act - send this to the insert method on the account service logic
            var Response = _customFieldsService.Insert(newCustomFieldsViewModel, null);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _customFieldsService.Insert(new CustomFieldsViewModel
            {
                OrganisationId = requiredOrganisationId,
                FieldType = 1
            }, null);

            // Act
            var result = _customFieldsService.View(new CustomFieldsViewModel { Id = result1.Data.Id }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _customFieldsService.Insert(new CustomFieldsViewModel
                {
                OrganisationId = requiredOrganisationId,
                FieldType = 1
               }
                , null);

            // Act
            result2.Data.Name = "Changed";
            var result = _customFieldsService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Name == result2.Data.Name);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _customFieldsService.Insert(new CustomFieldsViewModel
                {
                OrganisationId = requiredOrganisationId,
                FieldType = 1
                }
                , null);

            // Act
            var result = _customFieldsService.Delete(new CustomFieldsViewModel()
                    { Id = result4.Data.Id }
                , null);

            var result2 = _customFieldsService.View(new CustomFieldsViewModel()
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
            object filter = new { Id = "7388" };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _customFieldsService.List( new NgTableParams
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