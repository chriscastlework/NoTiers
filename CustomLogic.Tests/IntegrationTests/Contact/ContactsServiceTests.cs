using System.Diagnostics;
using System.Linq;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.ContactsService;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace CustomLogic.Tests.IntegrationTests.Contact
{
    [TestClass]
    public class ContactsServiceTests : VrTestBase
    {
        private readonly IService<ContactsViewModel> _contactsService = new ContactService(new VelocityRocketLegacy());
        private readonly string initialisedContactFirstName = "Test";


        [TestInitialize]
        public void Init()
        {
            var newContactsViewModel = new ContactsViewModel()
            {
                FirstName = initialisedContactFirstName
            };


            // Act - send this to the insert method on the account service logic
            var response = _contactsService.Insert(newContactsViewModel, null);
        }


        public Response<ContactsViewModel> ContactsResponse { get; set; }

        [TestMethod]
        public void Insert()
        {
            // Arrange - Create a new account view model
            var newContactsViewModel = new ContactsViewModel()
            {
                FirstName = "Chris"
            };


            // Act - send this to the insert method on the account service logic
            var response = _contactsService.Insert(newContactsViewModel, null);


            // Assert
            Assert.IsTrue(response.Success);

        }

        [TestMethod]
        public void View()
        {
            // Arrange - insert a deal so that we can pull it out
            var result1 = _contactsService.Insert(new ContactsViewModel
            {
                FirstName = ""
            }, null);

            // Act
            var result = _contactsService.View(new ContactsViewModel { Id = result1.Data.Id }, null);

            // Assert
            Assert.IsTrue(result.Success);

        }

        [TestMethod]
        public void Update()
        {
            // Arrange - insert a deal so that we have something to edit
            var result2 = _contactsService.Insert(new ContactsViewModel()
            {
                Title = "Test Contacts 1"
            }
            , null);

            // Act
            //result2.Data.Title = "Changed";
            var result = _contactsService.Update(result2.Data, null);


            // Assert
            Assert.IsTrue(result.Success);
            Assert.IsTrue(result.Data.Title == result2.Data.Title);

        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            var result4 = _contactsService.Insert(new ContactsViewModel
            {
                FirstName = initialisedContactFirstName
            }
            , null);

            // Act
            var result = _contactsService.Delete(new ContactsViewModel()
                {
                    Id = result4.Data.Id
                }
            , null);

            var result2 = _contactsService.View(new ContactsViewModel()
                {
                    Id = result4.Data.Id
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
            object filter = new { Name = initialisedContactFirstName };

#if DEBUG
            Stopwatch sw = new Stopwatch();
            sw.Start();
#endif
            // Act
            var result = _contactsService.List(new NgTableParams
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
