using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class QueryLogic : IViewListEvent<DealsViewModel, Deal>
    {
        public bool Run(NgTableParams model, ref IQueryable<Deal> repository, NgTable<DealsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            QueryToNgTable<DealsViewModel> ngTransformer = new QueryToNgTable<DealsViewModel>();

            var query = DealsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);

            return true;
        }
    }
}