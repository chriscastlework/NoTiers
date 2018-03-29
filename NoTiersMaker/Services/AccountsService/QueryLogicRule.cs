using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    public class QueryLogicRule : IViewListRule<AccountsViewModel, Account>
    {
        public bool Run(NgTableParams model, ref IQueryable<Account> repository, NgTable<AccountsViewModel> result, ICoreUser user, IUnitOfWork db)
        {

            //var kensUsers = db.With<User>().Where(c => c.OrganisationId == 396);
            
            //repository = repository.Where(c => kensUsers.Any(k => k.UserId == c.OwnerId));

            return true;
        }
    }
}