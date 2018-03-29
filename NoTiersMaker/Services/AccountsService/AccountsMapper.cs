using System.Linq;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    public static class AccountsMapper
    {


        public static Account MapInsertModelToDbModel(AccountsViewModel model, Account newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Account();
            }

            newDomainModel.Id = model.Id;
            newDomainModel.Name = model.Name;
            newDomainModel.RevenueCurrency = model.RevenueCurrency;
            newDomainModel.RevenueAmount = model.RevenueAmount;
            newDomainModel.AddressLine1 = model.AddressLine1;
            newDomainModel.AddressLine2 = model.AddressLine2;
            newDomainModel.County = model.County;
            newDomainModel.PostCode = model.PostCode;
            newDomainModel.PhoneNumber = model.PhoneNumber;
            newDomainModel.MainContactIndex = model.MainContactIndex;
            newDomainModel.OwnerId = model.OwnerId;
            newDomainModel.DateCreated = model.DateCreated;
            newDomainModel.DateLastModeified = model.DateLastModeified;
            newDomainModel.CreatedById = model.CreatedById;
            newDomainModel.LastModifiedById = model.LastModifiedById;
            newDomainModel.LogoImageId = model.LogoImage_Id;
            newDomainModel.City = model.City;
            newDomainModel.Country = model.Country;
            newDomainModel.AccountType = model.AccountType;
            newDomainModel.ExternalId = model.ExternalId;
            newDomainModel.SalesProcessId = model.SalesProcessId;
            newDomainModel.StageId = model.StageId;
            newDomainModel.Notes = model.Notes;

            return newDomainModel;
        }



        public static AccountsViewModel MapDbModelToViewModel(Account dbModel)
        {
            var viewModel = new AccountsViewModel();
            viewModel.Id = dbModel.Id;
            viewModel.Name = dbModel.Name;
            viewModel.RevenueCurrency = dbModel.RevenueCurrency;
            viewModel.RevenueAmount = dbModel.RevenueAmount;
            viewModel.AddressLine1 = dbModel.AddressLine1;
            viewModel.AddressLine2 = dbModel.AddressLine2;
            viewModel.County = dbModel.County;
            viewModel.PostCode = dbModel.PostCode;
            viewModel.PhoneNumber = dbModel.PhoneNumber;
            viewModel.MainContactIndex = dbModel.MainContactIndex;
            viewModel.OwnerId = dbModel.OwnerId;
            viewModel.DateCreated = dbModel.DateCreated;
            viewModel.DateLastModeified = dbModel.DateLastModeified;
            viewModel.CreatedById = dbModel.CreatedById;
            viewModel.LastModifiedById = dbModel.LastModifiedById;
            viewModel.LogoImage_Id = dbModel.LogoImageId;
            viewModel.City = dbModel.City;
            viewModel.Country = dbModel.Country;
            viewModel.AccountType = dbModel.AccountType;
            viewModel.ExternalId = dbModel.ExternalId;
            viewModel.SalesProcessId = dbModel.SalesProcessId;
            viewModel.StageId = dbModel.StageId;
            viewModel.Notes = dbModel.Notes;
            return viewModel;
        }

        public static IQueryable<AccountsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Account> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.Id).Select(c => new AccountsViewModel()
            {
                Id = c.Id,
                Name = c.Name,
                RevenueCurrency = c.RevenueCurrency,
                RevenueAmount = c.RevenueAmount,
                AddressLine1 = c.AddressLine1,
                AddressLine2 = c.AddressLine2,
                County = c.County,
                PostCode = c.PostCode,
                PhoneNumber = c.PhoneNumber,
                MainContactIndex = c.MainContactIndex,
                OwnerId = c.OwnerId,
                DateCreated = c.DateCreated,
                DateLastModeified = c.DateLastModeified,
                CreatedById = c.CreatedById,
                LastModifiedById = c.LastModifiedById,
                LogoImage_Id = c.LogoImageId,
                City = c.City,
                Country = c.Country,
                AccountType = c.AccountType,
                ExternalId = c.ExternalId,
                SalesProcessId = c.SalesProcessId,
                StageId = c.StageId,
                Notes = c.Notes,
            });
        }




    }
}