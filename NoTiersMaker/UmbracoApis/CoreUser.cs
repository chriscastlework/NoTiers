using System;
using CustomLogic.Core.Interfaces;

namespace CustomLogic.UmbracoApis
{
    public class CoreUser : ICoreUser
    {
        public string Id { get; set; }
        public string UserName { get; set; }

        public int OrganisationId { get; set; }
        public bool IsTestMode { get; set; }
        public string BaseCurrency { get; set; }
        public int? OrgId { get; set; }
        public string UserId { get; set; }
        public bool WsAdmin { get; set; }
        public string TimeZone { get; set; }
        public string Culture { get; set; }
        public bool NoUser { get; set; }
        public bool StcAdmin { get; set; }
        public int StcId { get; set; }
        public bool OrgAdmin { get; set; }
        public bool IsBuyer { get; set; }
        public DateTime FinancialYearStart { get; set; }
        public DateTime FinancialYearEnd { get; set; }
        public string OrgCurrencySymbol { get; set; }
        public bool IsManager { get; set; }
        public bool IsGlobalPermissions { get; set; }
        public int DefaultStcId { get; set; }
        public int? LoginCount { get; set; }
        public bool StopAnalytics { get; set; }
    }
}
