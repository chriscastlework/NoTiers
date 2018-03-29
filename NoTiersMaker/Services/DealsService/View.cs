using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class View : IViewEvent<DealsViewModel, Deal>
    {
        public int CreatedId = 0;

      
        public Response<DealsViewModel> Run(DealsViewModel model, ref IQueryable<Deal> repository, IUnitOfWork db, Response<DealsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = DealsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Deals");
            }

            return result;
        }
    }
}