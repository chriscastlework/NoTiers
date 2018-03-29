using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    public class View : IViewEvent<AccountsViewModel, Account>
    {
        public int CreatedId = 0;

     

        public Response<AccountsViewModel> Run(AccountsViewModel model, ref IQueryable<Account> repository, IUnitOfWork db, Response<AccountsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AccountsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Accounts");
            }

            return result;
        }
    }
}