using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
    public class QueryLogic : IViewListEvent<ContainerToolsViewModel, ContainerTool>
    {

         public bool Run(NgTableParams model, ref IQueryable<ContainerTool> repository, NgTable<ContainerToolsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<ContainerToolsViewModel>();

            var query = ContainerToolsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   