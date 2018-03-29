using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
    public class QueryLogic : IViewListEvent<TasksViewModel, Task>
    {

         public bool Run(NgTableParams model, ref IQueryable<Task> repository, NgTable<TasksViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<TasksViewModel>();

            var query = TasksMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   