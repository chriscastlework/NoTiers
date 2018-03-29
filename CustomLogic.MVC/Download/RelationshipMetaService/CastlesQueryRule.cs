using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
    public class LimitRelationshipMetas : IViewListRule<RelationshipMetaViewModel, RelationshipMeta>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<RelationshipMeta> repository, NgTable<RelationshipMetaViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

