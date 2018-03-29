using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    public class Delete : IDeleteEvent<FieldTypesViewModel,FieldType >
    {
  
        public bool Run(FieldTypesViewModel model, ref IQueryable<FieldType> repository, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<FieldType>().Find(model.Id);
            unitOfWork.With<FieldType>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
