using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.AccountsService;
using CustomLogic.Services.CustomFieldValuesService;
using KellermanSoftware.CompareNetObjects;
using Newtonsoft.Json;

namespace SpringXBuilder.MVC.Apis
{
    
    public class AccountController : ApiController
    {
        private  VelocityRocketLegacy db { get; set; }
        private  IService<AccountsViewModel> AccountService { get; set; }
        private  IService<CustomFieldValuesViewModel> CustomFieldValuesService { get; set; }

        public AccountController()
        {
            db = new VelocityRocketLegacy();
            AccountService = new AccountService(db);
            CustomFieldValuesService = new CustomFieldValueService(db);
        } 
        
        // GET: api/Account
        public NgTable<AccountsViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<AccountsViewModel> result = AccountService.List( queryTableParams, null);
            return result;
        }
        
        public Response<dynamic> Get(int id)
        {
            Response<dynamic> returnResult = new Response<dynamic>();

            GetDynamicAccount(id, returnResult);
            return returnResult;
        }

        private void GetDynamicAccount(int id, Response<dynamic> returnResult)
        {
            // move to service 

            Response<AccountsViewModel> result = AccountService.View(new AccountsViewModel {Id = id}, null);

            object filter = new
            {
                EntityId = result.Data.Id,
            };

            // Act
            var resultCustomFieldsService = CustomFieldValuesService.List( new NgTableParams
            {
                count = 1000,
                filter = JsonConvert.SerializeObject(filter)
            }, null);


            dynamic account = new ExpandoObject();

            account.Id = result.Data.Id;
            account.Name = result.Data.Name;
            account.RevenueCurrency = result.Data.RevenueCurrency;
            account.RevenueAmount = result.Data.RevenueAmount;
            account.AddressLine1 = result.Data.AddressLine1;
            account.AddressLine2 = result.Data.AddressLine2;
            account.County = result.Data.County;
            account.PostCode = result.Data.PostCode;
            account.PhoneNumber = result.Data.PhoneNumber;
            account.MainContactIndex = result.Data.MainContactIndex;
            account.OwnerId = result.Data.OwnerId;
            account.DateCreated = result.Data.DateCreated;
            account.DateLastModeified = result.Data.DateLastModeified;
            account.CreatedById = result.Data.CreatedById;
            account.LastModifiedById = result.Data.LastModifiedById;
            account.LogoImage_Id = result.Data.LogoImage_Id;
            account.City = result.Data.City;
            account.Country = result.Data.Country;
            account.AccountType = result.Data.AccountType;
            account.City = result.Data.City;
            account.Country = result.Data.Country;
            account.AccountType = result.Data.AccountType;
            account.ExternalId = result.Data.ExternalId;
            account.SalesProcessId = result.Data.SalesProcessId;
            account.StageId = result.Data.StageId;
            account.Notes = result.Data.Notes;
            account.Name = result.Data.Name;
            account.Name = result.Data.Name;

            var dictionary = (IDictionary<string, object>) account;
            foreach (var customField in resultCustomFieldsService.Data)
            {
                dictionary.Add("CustomField" + customField.CustomFieldId, customField.Value);
            }
            
            returnResult.Data = account;
        }

        // POST: api/Account
        public NgTable<AccountsViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<AccountsViewModel> result = AccountService.List( queryTableParams, null);

            return result;
        }
        

        // PUT: api/Account/5 TESTING
        public Response<dynamic> Put(int id, dynamic model)
        {
            // cast to standard object and save
            Response<dynamic> returnResult = new Response<dynamic>();
            GetDynamicAccount(id, returnResult);
            var compare = new CompareLogic();

            ComparisonResult compareResult = compare.Compare(returnResult.Data, model);

            Response<object> result = new Response<object>();
            string json = JsonConvert.SerializeObject(model);
            result.Data = JsonConvert.DeserializeObject(json);

            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(result.Data);

            return result;
        }

        // DELETE: api/Account/5
        public Response<AccountsViewModel> Delete(int id)
        {
            Response<AccountsViewModel> result = AccountService.Delete(new AccountsViewModel { Id = id }, null);

            return result;
        }
    }

}
