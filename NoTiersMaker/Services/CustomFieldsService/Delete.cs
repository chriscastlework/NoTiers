using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public class Delete : IDeleteEvent<CustomFieldsViewModel, CustomField>
    {
      

        public bool Run(CustomFieldsViewModel model, ref IQueryable<CustomField> repository, IUnitOfWork unitOfWork, Response<CustomFieldsViewModel> result, ICoreUser user)
        {
            var customToRemove = repository.SingleOrDefault(c=>c.Id == model.Id);
            unitOfWork.With<CustomField>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}