using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    public class QueryLogic : IViewListEvent<FieldTypesViewModel, FieldType>
    {

         public bool Run(NgTableParams model, ref IQueryable<FieldType> repository, NgTable<FieldTypesViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<FieldTypesViewModel>();

            var query = FieldTypesMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   