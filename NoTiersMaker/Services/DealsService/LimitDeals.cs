using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class LimitDeals : IViewListRule<DealsViewModel, Deal>
    {

        public bool Run(NgTableParams model, ref IQueryable<Deal> repository, NgTable<DealsViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
           // throw new System.NotImplementedException();
            return true;
        }
    }
}