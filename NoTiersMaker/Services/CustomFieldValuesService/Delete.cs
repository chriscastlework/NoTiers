using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class Delete : IDeleteEvent<CustomFieldValuesViewModel, CustomFieldValue>
    {
     
        public bool Run(CustomFieldValuesViewModel model, ref IQueryable<CustomFieldValue> repository, IUnitOfWork unitOfWork, Response<CustomFieldValuesViewModel> result,
            ICoreUser user)
        {
            var customToRemove = repository.SingleOrDefault(c=>c.CustomFieldId == model.CustomFieldId  && c.EntityId == model.EntityId);
            unitOfWork.With<CustomFieldValue>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}