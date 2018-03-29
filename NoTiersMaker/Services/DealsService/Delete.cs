using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class Delete : IDeleteEvent<DealsViewModel, Deal>
    {
     
        public bool Run(DealsViewModel model, ref IQueryable<Deal> repository, IUnitOfWork unitOfWork, Response<DealsViewModel> result, ICoreUser user)
        {
            var customToRemove = repository.SingleOrDefault(c=>c.Id == model.Id);
            unitOfWork.With<Deal>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}