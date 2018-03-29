using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldObjectService
{
    public class QueryLogic : IViewListEvent<AomFieldObjectViewModel, AomFieldObject>
    {

         public bool Run(NgTableParams model, ref IQueryable<AomFieldObject> repository, NgTable<AomFieldObjectViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomFieldObjectViewModel>();

            var query = AomFieldObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   