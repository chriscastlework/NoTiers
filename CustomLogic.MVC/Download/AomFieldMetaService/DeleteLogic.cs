using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldMetaService
{
    public class Delete : IDeleteEvent<AomFieldMetaViewModel,AomFieldMeta >
    {
  
        public bool Run(AomFieldMetaViewModel model, ref IQueryable<AomFieldMeta> repository, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomFieldMeta>().Find(model.Id);
            unitOfWork.With<AomFieldMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}