using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public class QueryLogic : IViewListEvent<CustomFieldsViewModel, CustomField>
    {
  
        public bool Run(NgTableParams model, ref IQueryable<CustomField> repository, NgTable<CustomFieldsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<CustomFieldsViewModel>();
        
            var query = CustomFieldsMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}