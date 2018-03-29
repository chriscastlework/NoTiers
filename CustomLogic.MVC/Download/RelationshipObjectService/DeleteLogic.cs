using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
    public class Delete : IDeleteEvent<RelationshipObjectViewModel,RelationshipObject >
    {
  
        public bool Run(RelationshipObjectViewModel model, ref IQueryable<RelationshipObject> repository, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<RelationshipObject>().Find(model.Id);
            unitOfWork.With<RelationshipObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
