using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldObjectService
{
    public class Delete : IDeleteEvent<AomFieldObjectViewModel,AomFieldObject >
    {
  
        public bool Run(AomFieldObjectViewModel model, ref IQueryable<AomFieldObject> repository, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomFieldObject>().Find(model.Id);
            unitOfWork.With<AomFieldObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}