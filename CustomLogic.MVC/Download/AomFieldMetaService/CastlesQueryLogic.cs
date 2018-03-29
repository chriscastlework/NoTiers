using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldMetaService
{
    public class QueryLogic : IViewListEvent<AomFieldMetaViewModel, AomFieldMeta>
    {

         public bool Run(NgTableParams model, ref IQueryable<AomFieldMeta> repository, NgTable<AomFieldMetaViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomFieldMetaViewModel>();

            var query = AomFieldMetaMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   