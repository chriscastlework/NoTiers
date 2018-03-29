using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class LimitOrganisation : IViewListRule<DealsViewModel, Deal>
    {
        public bool Run(NgTableParams model, ref IQueryable<Deal> repository, NgTable<DealsViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {

            if (user != null && user.OrgId > 0)
            {
                repository = repository.Where(c => c.Owner.OrganisationId1 == user.OrgId);
            }
            else
            {
                return true;
            }
            
            return true;
        }
    }
}