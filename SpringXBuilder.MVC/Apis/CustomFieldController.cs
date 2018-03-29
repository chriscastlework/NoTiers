using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldsService;

namespace SpringXBuilder.MVC.Apis
{
    public class CustomFieldController : ApiController
    {
        private readonly IService<CustomFieldsViewModel> _customFieldService = new CustomFieldService(new VelocityRocketLegacy());


        // GET: api/CustomField
        public NgTable<CustomFieldsViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<CustomFieldsViewModel> result = _customFieldService.List( queryTableParams, null);
            return result;
        }

        // GET: api/CustomField/5
        public Response<CustomFieldsViewModel> Get(int id)
        {
            Response<CustomFieldsViewModel> result = _customFieldService.View(new CustomFieldsViewModel { Id = id }, null);

            return result;
        }

        // POST: api/CustomField
        public NgTable<CustomFieldsViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<CustomFieldsViewModel> result = _customFieldService.List( queryTableParams, null);

            return result;
        }

        // PUT: api/CustomField/5
        public Response<CustomFieldsViewModel> Put(int id, CustomFieldsViewModel model)
        {
            Response<CustomFieldsViewModel> result = _customFieldService.Insert(model, null);

            return result;
        }

        // DELETE: api/CustomField/5
        public Response<CustomFieldsViewModel> Delete(int id)
        {
            Response<CustomFieldsViewModel> result = _customFieldService.Delete(new CustomFieldsViewModel { Id = id }, null);

            return result;
        }
    }
}