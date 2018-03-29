using System.Linq;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.ContactsService
{
    public static class ContactsMapper
    {


        public static Contact MapInsertModelToDbModel(ContactsViewModel model, Contact newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Contact();
            }

            newDomainModel.Id = model.Id;
            newDomainModel.FirstName = model.FirstName;
            newDomainModel.LastName = model.LastName;
            newDomainModel.Title = model.Title;
            newDomainModel.Location = model.Location;
            newDomainModel.Email = model.Email;
            newDomainModel.Phone = model.Phone;
            newDomainModel.Skype = model.Skype;
            newDomainModel.OrganisationId = model.OrganisationId;
            newDomainModel.JobTitle = model.JobTitle;
            newDomainModel.DateCreated = model.DateCreated;
            newDomainModel.DateLastModeified = model.DateLastModeified;
            newDomainModel.CreatedById = model.CreatedById;
            newDomainModel.LastModifiedById = model.LastModifiedById;
            newDomainModel.AccountId = model.AccountId;
            newDomainModel.LogoImageId = model.LogoImage_Id;
            newDomainModel.ExternalId = model.ExternalId;
            newDomainModel.SalesProcessId = model.SalesProcessId;
            newDomainModel.StageId = model.StageId;
            newDomainModel.Notes = model.Notes;
            newDomainModel.OfficePhone = model.OfficePhone;
            newDomainModel.MobilePhone = model.MobilePhone;
            newDomainModel.OtherPhone = model.OtherPhone;

            return newDomainModel;
        }



        public static ContactsViewModel MapDbModelToViewModel(Contact dbModel)
        {
            var viewModel = new ContactsViewModel();
            viewModel.Id = dbModel.Id;
            viewModel.FirstName = dbModel.FirstName;
            viewModel.LastName = dbModel.LastName;
            viewModel.Title = dbModel.Title;
            viewModel.Location = dbModel.Location;
            viewModel.Email = dbModel.Email;
            viewModel.Phone = dbModel.Phone;
            viewModel.Skype = dbModel.Skype;
            viewModel.OrganisationId = dbModel.OrganisationId;
            viewModel.JobTitle = dbModel.JobTitle;
            viewModel.DateCreated = dbModel.DateCreated;
            viewModel.DateLastModeified = dbModel.DateLastModeified;
            viewModel.CreatedById = dbModel.CreatedById;
            viewModel.LastModifiedById = dbModel.LastModifiedById;
            viewModel.AccountId = dbModel.AccountId;
            viewModel.LogoImage_Id = dbModel.LogoImageId;
            viewModel.ExternalId = dbModel.ExternalId;
            viewModel.SalesProcessId = dbModel.SalesProcessId;
            viewModel.StageId = dbModel.StageId;
            viewModel.Notes = dbModel.Notes;
            viewModel.OfficePhone = dbModel.OfficePhone;
            viewModel.MobilePhone = dbModel.MobilePhone;
            viewModel.OtherPhone = dbModel.OtherPhone;
            return viewModel;
        }

        public static IQueryable<ContactsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Contact> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.Id).Select(c => new ContactsViewModel()
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Title = c.Title,
                Location = c.Location,
                Email = c.Email,
                Phone = c.Phone,
                Skype = c.Skype,
                OrganisationId = c.OrganisationId,
                JobTitle = c.JobTitle,
                DateCreated = c.DateCreated,
                DateLastModeified = c.DateLastModeified,
                CreatedById = c.CreatedById,
                LastModifiedById = c.LastModifiedById,
                AccountId = c.AccountId,
                LogoImage_Id = c.LogoImageId,
                ExternalId = c.ExternalId,
                SalesProcessId = c.SalesProcessId,
                StageId = c.StageId,
                Notes = c.Notes,
                OfficePhone = c.OfficePhone,
                MobilePhone = c.MobilePhone,
                OtherPhone = c.OtherPhone,
            });
        }




    }
}
