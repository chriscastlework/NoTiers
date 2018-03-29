using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
    public class QueryLogic : IViewListEvent<AlertsViewModel, Alert>
    {

         public bool Run(NgTableParams model, ref IQueryable<Alert> repository, NgTable<AlertsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AlertsViewModel>();

            var query = AlertsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   