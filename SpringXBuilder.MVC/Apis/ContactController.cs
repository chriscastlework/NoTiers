using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.ContactsService;

namespace SpringXBuilder.MVC.Apis
{
    public class ContactController : ApiController
    {
        private readonly IService<ContactsViewModel> _contactService = new ContactService(new VelocityRocketLegacy());


        // GET: api/Contact
        public NgTable<ContactsViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<ContactsViewModel> result = _contactService.List( queryTableParams, null);
            return result;
        }

        // GET: api/Contact/5
        public Response<ContactsViewModel> Get(int id)
        {
            Response<ContactsViewModel> result = _contactService.View(new ContactsViewModel { Id = id }, null);

            return result;
        }

        // POST: api/Contact
        public NgTable<ContactsViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<ContactsViewModel> result = _contactService.List( queryTableParams,null);

            return result;
        }

        // PUT: api/Contact/5
        public Response<ContactsViewModel> Put(int id, ContactsViewModel model)
        {
            Response<ContactsViewModel> result = _contactService.Insert(model, null);

            return result;
        }

        // DELETE: api/Contact/5
        public Response<ContactsViewModel> Delete(int id)
        {
            Response<ContactsViewModel> result = _contactService.Delete(new ContactsViewModel { Id = id }, null);

            return result;
        }
    }
}