using System.Diagnostics;
using CustomLogic.Core.Database;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomObjectRowFieldsService;
using CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.CustomObjectRowFields
{

    [TestClass]
    public class CustomObjectRowFieldServiceTests : VrTestBase
    {

        public CustomObjectRowFieldServiceTests()
        {
            CustomObjectRowFieldService = new CustomObjectRowFieldService(new VelocityRocketLegacy());
        }

        public CustomObjectRowFieldService CustomObjectRowFieldService { get; set; }
        
        [TestMethod]
        public void Query()
        {

            // Arrange - insert a deal so that we have something to edit
            object filter = new {Value = "\"page\": "};

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = CustomObjectRowFieldService.List(new NgTableParams
            {
                
                filter = JsonConvert.SerializeObject(filter),
                count = 200

            },null);

#if DEBUG
            sw.Stop();
            var totalTime = sw.Elapsed.Seconds;

            foreach (var valueData in result.Data)
            {
                var canPass = JsonConvert.DeserializeObject<PageDefiniton>(valueData.Value);
            }

#endif

            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Count > 1);
            
        }
        
     

    }
}