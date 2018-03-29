using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public class Delete : IDeleteEvent<CustomObjectRowFieldsViewModel, CustomObjectRowField>
    {
      
        public bool Run(CustomObjectRowFieldsViewModel model, ref IQueryable<CustomObjectRowField> repository, IUnitOfWork unitOfWork, Response<CustomObjectRowFieldsViewModel> result,
            ICoreUser user)
        {
            var customToRemove = repository.SingleOrDefault(c=>c.Id == model.Id);
            unitOfWork.With<CustomObjectRowField>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}