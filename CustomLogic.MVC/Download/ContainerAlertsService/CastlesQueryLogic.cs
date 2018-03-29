using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerAlertsService
{
    public class QueryLogic : IViewListEvent<ContainerAlertsViewModel, ContainerAlert>
    {

         public bool Run(NgTableParams model, ref IQueryable<ContainerAlert> repository, NgTable<ContainerAlertsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<ContainerAlertsViewModel>();

            var query = ContainerAlertsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   