using System;
using System.Collections.Generic;
using System.Globalization;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web.Models;

namespace CustomLogic.Services.DealsService
{

    public class DealDetailRenderModel : RenderModel
    {
        public DealsViewModel DealViewModel { get; set; }

        public DealDetailRenderModel(IPublishedContent content, CultureInfo culture) : base(content, culture)
        {

        }

        public DealDetailRenderModel(IPublishedContent content) : base(content)
        {

        }

    }

    public class DealsViewModel 
    {
   
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string RevenueCurrency { get; set; }
        public decimal RevenueAmount { get; set; }
        public int? StageId { get; set; }
        public int? MainDealContactId { get; set; }
        public int? AccountId { get; set; }
        public int? SalesProcessId { get; set; }
        public DateTime? CloseDate { get; set; }
        public string CloseReason { get; set; }
        public int? CloseStatus { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateLastModeified { get; set; }
        public string CreatedById { get; set; }
        public string LastModifiedById { get; set; }
        public DateTime? StageLastUpdated { get; set; }
        public string Overview { get; set; }
        public DateTime? TrashDate { get; set; }
        public string TrashedUserId { get; set; }
        public int DealType { get; set; }
        public int? LeadRating { get; set; }
        public DateTime? LeadFollowUpDate { get; set; }
        public string LeadConversionApproverId { get; set; }
        public int? LeadContactId { get; set; }
        public decimal? LeadPotentialRevenue { get; set; }
        public int? LeadStatusId { get; set; }
        public string ExternalId { get; set; }
       
    }
}