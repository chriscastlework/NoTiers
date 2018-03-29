using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
    public class QueryLogic : IViewListEvent<AomObjectViewModel, AomObject>
    {

         public bool Run(NgTableParams model, ref IQueryable<AomObject> repository, NgTable<AomObjectViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomObjectViewModel>();

            var query = AomObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   