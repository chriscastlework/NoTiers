using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomObjectRowFieldsService;

namespace SpringXBuilder.MVC.Apis
{
    public class CustomObjectRowFieldController : ApiController
    {
        private readonly IService<CustomObjectRowFieldsViewModel> _customObjectRowFieldService = new CustomObjectRowFieldService(new VelocityRocketLegacy());


        // GET: api/CustomObjectRowField
        public NgTable<CustomObjectRowFieldsViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<CustomObjectRowFieldsViewModel> result = _customObjectRowFieldService.List(queryTableParams, null);
            return result;
        }

        // GET: api/CustomObjectRowField/5
        public Response<CustomObjectRowFieldsViewModel> Get(int id)
        {
            Response<CustomObjectRowFieldsViewModel> result = _customObjectRowFieldService.View(new CustomObjectRowFieldsViewModel { Id = id }, null);

            return result;
        }

        // POST: api/CustomObjectRowField
        public NgTable<CustomObjectRowFieldsViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<CustomObjectRowFieldsViewModel> result = _customObjectRowFieldService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/CustomObjectRowField/5
        public Response<CustomObjectRowFieldsViewModel> Put(int id, CustomObjectRowFieldsViewModel model)
        {
            Response<CustomObjectRowFieldsViewModel> result = _customObjectRowFieldService.Insert(model, null);

            return result;
        }

        // DELETE: api/CustomObjectRowField/5
        public Response<CustomObjectRowFieldsViewModel> Delete(int id)
        {
            Response<CustomObjectRowFieldsViewModel> result = _customObjectRowFieldService.Delete(new CustomObjectRowFieldsViewModel { Id = id }, null);

            return result;
        }
    }

}