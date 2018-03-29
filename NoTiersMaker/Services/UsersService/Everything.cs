using System;
using System.Data.Entity.Migrations;
using System.Linq;
using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.UsersService
{
 

        public class LimitUsers : IViewListRule<UsersViewModel, User>
        {
        
        public bool Run(NgTableParams model, ref IQueryable<User> repository, NgTable<UsersViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
            // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);

            return true;
        }
    }
    
    public class Delete : IDeleteEvent<UsersViewModel, User>
    {

        public bool Run(UsersViewModel model, ref IQueryable<User> repository, IUnitOfWork unitOfWork, Response<UsersViewModel> result, ICoreUser user)
        {
            var customToRemove = repository.FirstOrDefault(c=>c.UserId == model.UserId);
            unitOfWork.With<User>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
    public class QueryLogic : IViewListEvent<UsersViewModel, User>
    {
        public bool Run(NgTableParams model, ref IQueryable<User> repository, NgTable<UsersViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<UsersViewModel>();

            var query = UsersMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class UserService : ServiceBase<UsersViewModel, User>
    {
        public UserService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
   
    public class Update : IUpdateEvent<UsersViewModel, User>
    {
     
        public int priority()
        {
            return 1;
        }

        public bool Run(UsersViewModel model, ref IQueryable<User> repository, IUnitOfWork unitOfWork, Response<UsersViewModel> result, ICoreUser user)
        {
            var dbModel = repository.FirstOrDefault(c=>c.UserId == model.UserId);
            var updatedDbModel = UsersMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<User>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = UsersMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
    public class View : IViewEvent<UsersViewModel, User>
    {
      

        public Response<UsersViewModel> Run(UsersViewModel model, ref IQueryable<User> repository, IUnitOfWork db, Response<UsersViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.UserId == model.UserId);

            if (itemToUpdate != null)
            {
                var newCustomResult = UsersMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Users");
            }

            return result;
        }
    }
    public class Save : IInsertEvent<UsersViewModel>
    {
        public string CreatedId = string.Empty;

        public bool Run(UsersViewModel model, IUnitOfWork unitOfWork, Response<UsersViewModel> result, ICoreUser user)
        {

            var newCustom = UsersMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<User>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.UserId;
            var newCustomResult = UsersMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(UsersViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<User>().FirstOrDefault(c => c.UserId == CreatedId);
            unitOfWork.With<User>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
    public static class UsersMapper
    {


        public static User MapInsertModelToDbModel(UsersViewModel model, User newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new User();
            }

            newDomainModel.UserId = model.UserId;
            newDomainModel.Email = model.Email;
            newDomainModel.EmailConfirmed = model.EmailConfirmed;
            newDomainModel.PasswordHash = model.PasswordHash;
            newDomainModel.SecurityStamp = model.SecurityStamp;
            newDomainModel.PhoneNumber = model.PhoneNumber;
            newDomainModel.PhoneNumberConfirmed = model.PhoneNumberConfirmed;
            newDomainModel.TwoFactorEnabled = model.TwoFactorEnabled;
            newDomainModel.LockoutEndDateUtc = model.LockoutEndDateUtc;
            newDomainModel.LockoutEnabled = model.LockoutEnabled;
            newDomainModel.AccessFailedCount = model.AccessFailedCount;
            newDomainModel.UserName = model.UserName;
            newDomainModel.FirstName = model.FirstName;
            newDomainModel.LastName = model.LastName;
            newDomainModel.OrganisationId = model.OrganisationId;
            newDomainModel.UserStatus = model.UserStatus;
            newDomainModel.UserProfileId = model.UserProfileId;
            newDomainModel.TaskId = model.Task_Id;
            newDomainModel.VerificationCode = model.VerificationCode;
            newDomainModel.OrganisationId = model.Organisation_Id;
            newDomainModel.SystemPreferencesId = model.SystemPreferences_Id;
            newDomainModel.LogoImageId = model.LogoImage_Id;
            newDomainModel.LoginCount = model.LoginCount;
            newDomainModel.CreateDateTime = model.CreateDateTime;
            newDomainModel.ManagerId = model.ManagerId;
            newDomainModel.ExternalId = model.ExternalId;

            return newDomainModel;
        }



        public static UsersViewModel MapDbModelToViewModel(User dbModel)
        {
            var viewModel = new UsersViewModel();
            viewModel.UserId = dbModel.UserId;
            viewModel.Email = dbModel.Email;
            viewModel.EmailConfirmed = dbModel.EmailConfirmed;
            viewModel.PasswordHash = dbModel.PasswordHash;
            viewModel.SecurityStamp = dbModel.SecurityStamp;
            viewModel.PhoneNumber = dbModel.PhoneNumber;
            viewModel.PhoneNumberConfirmed = dbModel.PhoneNumberConfirmed;
            viewModel.TwoFactorEnabled = dbModel.TwoFactorEnabled;
            viewModel.LockoutEndDateUtc = dbModel.LockoutEndDateUtc;
            viewModel.LockoutEnabled = dbModel.LockoutEnabled;
            viewModel.AccessFailedCount = dbModel.AccessFailedCount;
            viewModel.UserName = dbModel.UserName;
            viewModel.FirstName = dbModel.FirstName;
            viewModel.LastName = dbModel.LastName;
            viewModel.OrganisationId = dbModel.OrganisationId;
            viewModel.UserStatus = dbModel.UserStatus;
            viewModel.UserProfileId = dbModel.UserProfileId;
            viewModel.Task_Id = dbModel.TaskId;
            viewModel.VerificationCode = dbModel.VerificationCode;
            viewModel.Organisation_Id = dbModel.OrganisationId;
            viewModel.SystemPreferences_Id = dbModel.SystemPreferencesId;
            viewModel.LogoImage_Id = dbModel.LogoImageId;
            viewModel.LoginCount = dbModel.LoginCount;
            viewModel.CreateDateTime = dbModel.CreateDateTime;
            viewModel.ManagerId = dbModel.ManagerId;
            viewModel.ExternalId = dbModel.ExternalId;
            return viewModel;
        }

        public static IQueryable<UsersViewModel> MapDbModelQueryToViewModelQuery(IQueryable<User> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.UserId).Select(c => new UsersViewModel()
            {
                UserId = c.UserId,
                Email = c.Email,
                EmailConfirmed = c.EmailConfirmed,
                PasswordHash = c.PasswordHash,
                SecurityStamp = c.SecurityStamp,
                PhoneNumber = c.PhoneNumber,
                PhoneNumberConfirmed = c.PhoneNumberConfirmed,
                TwoFactorEnabled = c.TwoFactorEnabled,
                LockoutEndDateUtc = c.LockoutEndDateUtc,
                LockoutEnabled = c.LockoutEnabled,
                AccessFailedCount = c.AccessFailedCount,
                UserName = c.UserName,
                FirstName = c.FirstName,
                LastName = c.LastName,
                OrganisationId = c.OrganisationId,
                UserStatus = c.UserStatus,
                UserProfileId = c.UserProfileId,
                Task_Id = c.TaskId,
                VerificationCode = c.VerificationCode,
                Organisation_Id = c.OrganisationId,
                SystemPreferences_Id = c.SystemPreferencesId,
                LogoImage_Id = c.LogoImageId,
                LoginCount = c.LoginCount,
                CreateDateTime = c.CreateDateTime,
                ManagerId = c.ManagerId,
                ExternalId = c.ExternalId,
            });
        }
    }
    
    public class UsersViewModel
    {
        public UsersViewModel()
        {
            UserId = Guid.NewGuid().ToString();
        }
        public string UserId { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTime? LockoutEndDateUtc { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? OrganisationId { get; set; }
        public int? UserStatus { get; set; }
        public int? UserProfileId { get; set; }
        public int? Task_Id { get; set; }
        public string VerificationCode { get; set; }
        public int? Organisation_Id { get; set; }
        public int? SystemPreferences_Id { get; set; }
        public int? LogoImage_Id { get; set; }
        public int? LoginCount { get; set; }
        public DateTime? CreateDateTime { get; set; }
        public string ManagerId { get; set; }
        public string ExternalId { get; set; }

    }


}
