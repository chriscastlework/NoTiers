using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldValuesService;

namespace SpringXBuilder.MVC.Apis
{
    public class CustomFieldValueController : ApiController
    {
        private readonly IService<CustomFieldValuesViewModel> _customFieldValueService = new CustomFieldValueService(new VelocityRocketLegacy());


        // GET: api/CustomFieldValue WILL ONLY RETURN 10
        public NgTable<CustomFieldValuesViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<CustomFieldValuesViewModel> result = _customFieldValueService.List(queryTableParams, null);
            return result;
        }

        // GET: api/CustomFieldValue/5  IMPOSSIBLE DULE KEY
        //public Response<CustomFieldValuesViewModel> Get(int id)
        //{
        //    // can not do this
        //    Response<CustomFieldValuesViewModel> result = CustomFieldValueService.View(new CustomFieldValuesViewModel { EntityId = id }, null);

        //    return result;
        //}

        // POST: api/CustomFieldValue
        public NgTable<CustomFieldValuesViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<CustomFieldValuesViewModel> result = _customFieldValueService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/CustomFieldValue/5
        public Response<CustomFieldValuesViewModel> Put(int id, CustomFieldValuesViewModel model)
        {
            Response<CustomFieldValuesViewModel> result = _customFieldValueService.Insert(model, null);

            return result;
        }

        // DELETE: api/CustomFieldValue/5 IMPOSSIBLE DULE KEY
        //public Response<CustomFieldValuesViewModel> Delete(int id)
        //{
        //    Response<CustomFieldValuesViewModel> result = CustomFieldValueService.Delete(new CustomFieldValuesViewModel { EntityId = id }, null);

        //    return result;
        //}
    }
    
}
