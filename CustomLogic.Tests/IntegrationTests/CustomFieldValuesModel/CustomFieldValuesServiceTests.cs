using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldValuesService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.CustomFieldValuesModel
{
    [TestClass]
    public class CustomFieldValuesServiceTests : VrTestBase
    {
        private readonly IService<CustomFieldValuesViewModel> _customFieldValuesService = new CustomFieldValueService(new VelocityRocketLegacy());
        
        private const int constCustomFieldId = 11; // Custom filed must already exist
        

        public Response<CustomFieldValuesViewModel> CustomFieldValuesResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newCustomFieldValuesViewModel = new CustomFieldValuesViewModel()
            {
                EntityId = 1000000,
                CustomFieldId = constCustomFieldId
            };


            // Act - send this to the insert method on the account service logic
            var Response = _customFieldValuesService.Insert(newCustomFieldValuesViewModel, null);


            // Assert
            Assert.IsTrue(Response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _customFieldValuesService.Insert(new CustomFieldValuesViewModel
            {
                EntityId = 1000001,
                CustomFieldId = constCustomFieldId
            }, null);

            // Act
            var result = _customFieldValuesService.View(new CustomFieldValuesViewModel
            {
                EntityId = result1.Data.EntityId,
                CustomFieldId = result1.Data.CustomFieldId
            }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _customFieldValuesService.Insert(new CustomFieldValuesViewModel()
            {
                EntityId = 1000002,
                CustomFieldId = constCustomFieldId
            }
            , null);

            // Act
            result2.Data.Value = "Changed";
            var result = _customFieldValuesService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Value == result2.Data.Value);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _customFieldValuesService.Insert(new CustomFieldValuesViewModel
            {
                EntityId = 1000004,
                CustomFieldId = constCustomFieldId
            }
            , null);

            // Act
            var result = _customFieldValuesService.Delete(new CustomFieldValuesViewModel()
                {
                EntityId = result4.Data.EntityId,
                CustomFieldId = result4.Data.CustomFieldId
            }
            , null);

            var result2 = _customFieldValuesService.View(new CustomFieldValuesViewModel()
            {
                EntityId = result4.Data.EntityId,
                CustomFieldId = result4.Data.CustomFieldId
            }
            , null);

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(!result2.Success);
        }


        [TestMethod]
        public void Query()
        {

            // Arrange - insert a deal so that we have something to edit
            object filter = new { EntityId = "30010" };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _customFieldValuesService.List( new NgTableParams
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
