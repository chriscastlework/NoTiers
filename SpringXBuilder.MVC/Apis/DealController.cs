using System.Collections.Generic;
using System.Dynamic;
using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldValuesService;
using CustomLogic.Services.DealsService;
using Newtonsoft.Json;

namespace SpringXBuilder.MVC.Apis
{
    public class DealController : ApiController
    {
        private VelocityRocketLegacy db;
        private readonly DealService _dealService;
        private IService<CustomFieldValuesViewModel> CustomFieldValuesService;

        public DealController()
        {
            db = new VelocityRocketLegacy();
            _dealService = new DealService(db);
            CustomFieldValuesService = new CustomFieldValueService(db);
        }

        // GET: api/Deal
        public NgTable<DealsViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<DealsViewModel> result = _dealService.List( queryTableParams, null);
            return result;
        }

        // GET: api/Deal/5
        public Response<dynamic> Get(int id)
        {
            Response<dynamic> returnResult = new Response<dynamic>();
            GetDynamicDeal(id, returnResult);
            return returnResult;
        }

        // POST: api/Deal
        public NgTable<DealsViewModel> Post(NgTableParams queryTableParams)
        {

            NgTable<DealsViewModel> result = _dealService.List( queryTableParams, null);
            return result;
        }

        // PUT: api/Deal/5
        public Response<DealsViewModel> Put(int id, DealsViewModel model)
        {
            Response<DealsViewModel> result = _dealService.Insert(model, null);
            return result;
        }

        // DELETE: api/Deal/5
        public Response<DealsViewModel> Delete(int id)
        {
            Response<DealsViewModel> result = _dealService.Delete(new DealsViewModel { Id = id }, null);
            return result;
        }

        private void GetDynamicDeal(int id, Response<dynamic> returnResult)
        {
            // move to service 

            Response<DealsViewModel> result = _dealService.View(new DealsViewModel { Id = id }, null);

            object filter = new
            {
                EntityId = result.Data.Id,
            };

            // Act
            var resultCustomFieldsService = CustomFieldValuesService.List(new NgTableParams
            {
                count = 1000,
                filter = JsonConvert.SerializeObject(filter)
            }, null);


            dynamic Deal = new ExpandoObject();

            Deal.Id = result.Data.Id;
            Deal.Name = result.Data.Name;
            Deal.RevenueCurrency = result.Data.RevenueCurrency;
            Deal.RevenueAmount = result.Data.RevenueAmount;
            Deal.OwnerId = result.Data.OwnerId;
            Deal.DateCreated = result.Data.DateCreated;
            Deal.DateLastModeified = result.Data.DateLastModeified;
            Deal.CreatedById = result.Data.CreatedById;
            Deal.LastModifiedById = result.Data.LastModifiedById;
            Deal.ExternalId = result.Data.ExternalId;
            Deal.SalesProcessId = result.Data.SalesProcessId;
            Deal.StageId = result.Data.StageId;
            Deal.Name = result.Data.Name;
            Deal.Name = result.Data.Name;

            var dictionary = (IDictionary<string, object>)Deal;
            foreach (var customField in resultCustomFieldsService.Data)
            {
                dictionary.Add("CustomField" + customField.CustomFieldId, customField.Value);
            }

            returnResult.Data = Deal;
        }
    }
}
