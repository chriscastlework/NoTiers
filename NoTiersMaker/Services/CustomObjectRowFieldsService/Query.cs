using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public class QueryLogic : IViewListEvent<CustomObjectRowFieldsViewModel, CustomObjectRowField>
    {
        public bool Run(NgTableParams model, ref IQueryable<CustomObjectRowField> repository, NgTable<CustomObjectRowFieldsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            QueryToNgTable<CustomObjectRowFieldsViewModel> ngTransformer = new QueryToNgTable<CustomObjectRowFieldsViewModel>();
            
            var query = CustomObjectRowFieldsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}