using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
    public class QueryLogic : IViewListEvent<RelationshipMetaViewModel, RelationshipMeta>
    {

         public bool Run(NgTableParams model, ref IQueryable<RelationshipMeta> repository, NgTable<RelationshipMetaViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<RelationshipMetaViewModel>();

            var query = RelationshipMetaMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   