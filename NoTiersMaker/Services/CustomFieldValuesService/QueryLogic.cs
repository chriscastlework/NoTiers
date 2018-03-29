using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class QueryLogic : IViewListEvent<CustomFieldValuesViewModel, CustomFieldValue>
    {
        public bool Run(NgTableParams model, ref IQueryable<CustomFieldValue> repository, NgTable<CustomFieldValuesViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<CustomFieldValuesViewModel>();
            
            var query = CustomFieldValuesMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);

            return true;
        }
    }
}