using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
    public class Delete : IDeleteEvent<AomObjectViewModel,AomObject >
    {
  
        public bool Run(AomObjectViewModel model, ref IQueryable<AomObject> repository, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomObject>().Find(model.Id);
            unitOfWork.With<AomObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
