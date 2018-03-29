using System;

namespace CustomLogic.Core.Interfaces
{
    /// <summary>
    /// Some basic user information will need to be decided on each project
    /// </summary>
    public interface ICoreUser
    {
        /// <summary>
        /// Sometimes when running in test mode things will not happen i.e pis updates 
        /// </summary>
        bool IsTestMode { get; set; }

        bool StopAnalytics { get; set; }

        string BaseCurrency { get; set; }
        // Resolved in the UI level
        int? OrgId { get; set; }
        string UserId { get; set; }
        bool WsAdmin { get; set; }
        string TimeZone { get; set; }
        string Culture { get; set; }
        bool NoUser { get; set; }
        bool StcAdmin { get; set; }
        int StcId { get; set; }
        bool OrgAdmin { get; set; }
        bool IsBuyer { get; set; }

        DateTime FinancialYearStart { get; set; }
        DateTime FinancialYearEnd { get; set; }
        string OrgCurrencySymbol { get; set; }
        bool IsManager { get; set; }
        //  Domain.Model.EditionLevel EditionLevel { get; set; }
        bool IsGlobalPermissions { get; set; }
        int DefaultStcId { get; set; }
        //    List<ApplicationUserRole> Roles { get; set; }
        int? LoginCount { get; set; }
    }
}
