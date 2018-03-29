using System.Linq;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public static class DealsMapper
    {


        public static Deal MapInsertModelToDbModel(DealsViewModel model, Deal newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Deal();
            }

            newDomainModel.Id = model.Id;
            newDomainModel.Name = model.Name;
            newDomainModel.OwnerId = model.OwnerId;
            newDomainModel.StartDate = model.StartDate;
            newDomainModel.ExpectedCloseDate = model.ExpectedCloseDate;
            newDomainModel.RevenueCurrency = model.RevenueCurrency;
            newDomainModel.RevenueAmount = model.RevenueAmount;
            newDomainModel.StageId = model.StageId;
            newDomainModel.MainDealContactId = model.MainDealContactId;
            newDomainModel.AccountId = model.AccountId;
            newDomainModel.SalesProcessId = model.SalesProcessId;
            newDomainModel.CloseDate = model.CloseDate;
            newDomainModel.CloseReason = model.CloseReason;
            newDomainModel.CloseStatus = model.CloseStatus;
            newDomainModel.DateCreated = model.DateCreated;
            newDomainModel.DateLastModeified = model.DateLastModeified;
            newDomainModel.CreatedById = model.CreatedById;
            newDomainModel.LastModifiedById = model.LastModifiedById;
            newDomainModel.StageLastUpdated = model.StageLastUpdated;
            newDomainModel.Overview = model.Overview;
            newDomainModel.TrashDate = model.TrashDate;
            newDomainModel.TrashedUserId = model.TrashedUserId;
            newDomainModel.DealType = model.DealType;
            newDomainModel.LeadRating = model.LeadRating;
            newDomainModel.LeadFollowUpDate = model.LeadFollowUpDate;
            newDomainModel.LeadConversionApproverId = model.LeadConversionApproverId;
            newDomainModel.LeadContactId = model.LeadContactId;
            newDomainModel.LeadPotentialRevenue = model.LeadPotentialRevenue;
            newDomainModel.LeadStatusId = model.LeadStatusId;
            newDomainModel.ExternalId = model.ExternalId;

            return newDomainModel;
        }



        public static DealsViewModel MapDbModelToViewModel(Deal dbModel)
        {
            var viewModel = new DealsViewModel();
            viewModel.Id = dbModel.Id;
            viewModel.Name = dbModel.Name;
            viewModel.OwnerId = dbModel.OwnerId;
            viewModel.StartDate = dbModel.StartDate;
            viewModel.ExpectedCloseDate = dbModel.ExpectedCloseDate;
            viewModel.RevenueCurrency = dbModel.RevenueCurrency;
            viewModel.RevenueAmount = dbModel.RevenueAmount;
            viewModel.StageId = dbModel.StageId;
            viewModel.MainDealContactId = dbModel.MainDealContactId;
            viewModel.AccountId = dbModel.AccountId;
            viewModel.SalesProcessId = dbModel.SalesProcessId;
            viewModel.CloseDate = dbModel.CloseDate;
            viewModel.CloseReason = dbModel.CloseReason;
            viewModel.CloseStatus = dbModel.CloseStatus;
            viewModel.DateCreated = dbModel.DateCreated;
            viewModel.DateLastModeified = dbModel.DateLastModeified;
            viewModel.CreatedById = dbModel.CreatedById;
            viewModel.LastModifiedById = dbModel.LastModifiedById;
            viewModel.StageLastUpdated = dbModel.StageLastUpdated;
            viewModel.Overview = dbModel.Overview;
            viewModel.TrashDate = dbModel.TrashDate;
            viewModel.TrashedUserId = dbModel.TrashedUserId;
            viewModel.DealType = dbModel.DealType;
            viewModel.LeadRating = dbModel.LeadRating;
            viewModel.LeadFollowUpDate = dbModel.LeadFollowUpDate;
            viewModel.LeadConversionApproverId = dbModel.LeadConversionApproverId;
            viewModel.LeadContactId = dbModel.LeadContactId;
            viewModel.LeadPotentialRevenue = dbModel.LeadPotentialRevenue;
            viewModel.LeadStatusId = dbModel.LeadStatusId;
            viewModel.ExternalId = dbModel.ExternalId;
            return viewModel;
        }

        public static IQueryable<DealsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Deal> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.Id).Select(c => new DealsViewModel()
            {
                Id = c.Id,
                Name = c.Name,
                OwnerId = c.OwnerId,
                StartDate = c.StartDate,
                ExpectedCloseDate = c.ExpectedCloseDate,
                RevenueCurrency = c.RevenueCurrency,
                RevenueAmount = c.RevenueAmount,
                StageId = c.StageId,
                MainDealContactId = c.MainDealContactId,
                AccountId = c.AccountId,
                SalesProcessId = c.SalesProcessId,
                CloseDate = c.CloseDate,
                CloseReason = c.CloseReason,
                CloseStatus = c.CloseStatus,
                DateCreated = c.DateCreated,
                DateLastModeified = c.DateLastModeified,
                CreatedById = c.CreatedById,
                LastModifiedById = c.LastModifiedById,
                StageLastUpdated = c.StageLastUpdated,
                Overview = c.Overview,
                TrashDate = c.TrashDate,
                TrashedUserId = c.TrashedUserId,
                DealType = c.DealType,
                LeadRating = c.LeadRating,
                LeadFollowUpDate = c.LeadFollowUpDate,
                LeadConversionApproverId = c.LeadConversionApproverId,
                LeadContactId = c.LeadContactId,
                LeadPotentialRevenue = c.LeadPotentialRevenue,
                LeadStatusId = c.LeadStatusId,
                ExternalId = c.ExternalId,
            });
        }
        
    }

}
