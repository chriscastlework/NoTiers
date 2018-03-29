using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    public class QueryLogic : IViewListEvent<MigrationHistoryViewModel, MigrationHistory>
    {

         public bool Run(NgTableParams model, ref IQueryable<MigrationHistory> repository, NgTable<MigrationHistoryViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<MigrationHistoryViewModel>();

            var query = MigrationHistoryMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   