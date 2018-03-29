using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomMetaService
{
    public class LimitAomMetas : IViewListRule<AomMetaViewModel, AomMeta>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<AomMeta> repository, NgTable<AomMetaViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

