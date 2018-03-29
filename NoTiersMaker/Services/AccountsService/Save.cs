using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    
    public class Save : IInsertEvent<AccountsViewModel>
    {
        public int CreatedId = 0;

        public bool Run(AccountsViewModel model, IUnitOfWork unitOfWork, Response<AccountsViewModel> result, ICoreUser user)
        {

            var newCustom = AccountsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Account>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = AccountsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AccountsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Account>().FirstOrDefault(c => c.Id == CreatedId);
            unitOfWork.With<Account>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}