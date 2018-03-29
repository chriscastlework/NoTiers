using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainersService
{
    public class QueryLogic : IViewListEvent<ContainersViewModel, Container>
    {

         public bool Run(NgTableParams model, ref IQueryable<Container> repository, NgTable<ContainersViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<ContainersViewModel>();

            var query = ContainersMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
}
   