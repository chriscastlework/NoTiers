﻿using System.Collections.Generic;
using System.Dynamic;
using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomFieldValuesService;
using CustomLogic.Services.DealsService;
using Newtonsoft.Json;
using umbraco.cms.businesslogic.member;
using Umbraco.Web.WebApi;

namespace CustomLogic.UmbracoApis.RestControllers
{
    public class DealsController : UmbracoApiController
    {
        private VelocityRocketLegacy db;
        private readonly DealService _dealService;
        private readonly IService<CustomFieldValuesViewModel> CustomFieldValuesService;
        private ICoreUser CoreUser { get; set; }

        private static void GetCurrentUserId(ICoreUser coreUser)
        {
            var mymember = Member.GetCurrentMember();

            if (mymember != null)
            {
               
                coreUser.UserId = mymember.getProperty("velocityRocketUserID").Value.ToString();
                coreUser.OrgId = int.Parse(mymember.getProperty("organisationID").Value.ToString());
            }
        }

        public DealsController()
        {
            db = new VelocityRocketLegacy();
            _dealService = new DealService(db);
            CustomFieldValuesService = new CustomFieldValueService(db);
            CoreUser = new CoreUser();
            GetCurrentUserId(CoreUser);
        }

       [HttpGet]
        // GET: // GET: ~/Umbraco/Api/Deals/Get/Id
        public Response<dynamic> Get(int id)
        {
            Response<dynamic> returnResult = new Response<dynamic>();
            GetDynamicDeal(id, returnResult);
            return returnResult;
        }


        [HttpPost]
        // POST: // GET: ~/Umbraco/Api/Deals/Post
        public NgTable<DealsViewModel> Post(NgTableParams queryTableParams)
        {

            NgTable<DealsViewModel> result = _dealService.List(queryTableParams, CoreUser);
            
            return result;
        }


        [HttpPut]
        // PUT: ~/Umbraco/Api/Deals/Put
        public Response<DealsViewModel> Put(int id, DealsViewModel model)
        {
            Response<DealsViewModel> result = _dealService.Insert(model, CoreUser);
            return result;
        }

        [HttpDelete]
        // DELETE: ~/Umbraco/Api/Deals/Delete
        public Response<DealsViewModel> Delete(int id)
        {
            Response<DealsViewModel> result = _dealService.Delete(new DealsViewModel { Id = id }, CoreUser);
            return result;
        }

        private void GetDynamicDeal(int id, Response<dynamic> returnResult)
        {
            // move to service 

            Response<DealsViewModel> result = _dealService.View(new DealsViewModel { Id = id }, CoreUser);

            object filter = new
            {
                EntityId = result.Data.Id,
            };
            var filterParams = new NgTableParams
            {
                count = 1000,
                filter = JsonConvert.SerializeObject(filter)
            };
            var Deal = AddCustomFieldsToDeal(filterParams, result.Data);

            returnResult.Data = Deal;
        }


        /// <summary>
        /// Not acceptable for many deals
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        private dynamic AddCustomFieldsToDeal(NgTableParams filter, DealsViewModel result)
        {
// Act
            var resultCustomFieldsService = CustomFieldValuesService.List(filter, CoreUser);
            
            dynamic Deal = new ExpandoObject();

            Deal.Id = result.Id;
            Deal.Name = result.Name;
            Deal.RevenueCurrency = result.RevenueCurrency;
            Deal.RevenueAmount = result.RevenueAmount;
            Deal.OwnerId = result.OwnerId;
            Deal.DateCreated = result.DateCreated;
            Deal.DateLastModeified = result.DateLastModeified;
            Deal.CreatedById = result.CreatedById;
            Deal.LastModifiedById = result.LastModifiedById;
            Deal.ExternalId = result.ExternalId;
            Deal.SalesProcessId = result.SalesProcessId;
            Deal.StageId = result.StageId;
            Deal.Name = result.Name;
            Deal.Name = result.Name;

            var dictionary = (IDictionary<string, object>) Deal;
            foreach (var customField in resultCustomFieldsService.Data)
            {
                dictionary.Add("CustomField" + customField.CustomFieldId, customField.Value);
            }
            return Deal;
        }
    }
}
