using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
    public class Delete : IDeleteEvent<RelationshipMetaViewModel,RelationshipMeta >
    {
  
        public bool Run(RelationshipMetaViewModel model, ref IQueryable<RelationshipMeta> repository, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<RelationshipMeta>().Find(model.Id);
            unitOfWork.With<RelationshipMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
