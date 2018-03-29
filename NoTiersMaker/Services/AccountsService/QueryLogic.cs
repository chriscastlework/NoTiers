using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    public class QueryLogic : IViewListEvent<AccountsViewModel, Account>
    {
        public bool Run(NgTableParams model, ref IQueryable<Account> repository, NgTable<AccountsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AccountsViewModel>();
            
            var query = AccountsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);

            return true;
        }
    }
}