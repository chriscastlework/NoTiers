using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
    public class LimitRelationshipObjects : IViewListRule<RelationshipObjectViewModel, RelationshipObject>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<RelationshipObject> repository, NgTable<RelationshipObjectViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

