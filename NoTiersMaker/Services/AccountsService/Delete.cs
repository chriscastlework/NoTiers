using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    public class Delete : IDeleteEvent<AccountsViewModel, Account>
    {
     

        public bool Run(AccountsViewModel model, ref IQueryable<Account> repository, IUnitOfWork unitOfWork, Response<AccountsViewModel> result, ICoreUser user)
        {
            var customToRemove = repository.SingleOrDefault(c=>c.Id==model.Id);
            unitOfWork.With<Account>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}