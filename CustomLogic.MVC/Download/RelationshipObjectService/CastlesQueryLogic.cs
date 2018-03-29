using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
    public class QueryLogic : IViewListEvent<RelationshipObjectViewModel, RelationshipObject>
    {

         public bool Run(NgTableParams model, ref IQueryable<RelationshipObject> repository, NgTable<RelationshipObjectViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<RelationshipObjectViewModel>();

            var query = RelationshipObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   