using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
    public class QueryLogic : IViewListEvent<ToolsViewModel, Tool>
    {

         public bool Run(NgTableParams model, ref IQueryable<Tool> repository, NgTable<ToolsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<ToolsViewModel>();

            var query = ToolsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   