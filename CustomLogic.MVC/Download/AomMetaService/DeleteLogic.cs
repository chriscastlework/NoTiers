using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomMetaService
{
    public class Delete : IDeleteEvent<AomMetaViewModel,AomMeta >
    {
  
        public bool Run(AomMetaViewModel model, ref IQueryable<AomMeta> repository, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomMeta>().Find(model.Id);
            unitOfWork.With<AomMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
