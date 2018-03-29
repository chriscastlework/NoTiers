using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
    public class LimitAomObjects : IViewListRule<AomObjectViewModel, AomObject>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<AomObject> repository, NgTable<AomObjectViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

