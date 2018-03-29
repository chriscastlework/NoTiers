using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
    public class View : IViewEvent<AomObjectViewModel,AomObject >
    {
        public int CreatedId = 0;

        public Response<AomObjectViewModel> Run(AomObjectViewModel model,ref IQueryable<AomObject> repository, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomObject"); 
            }

            return result;
        }

  
    
    }
}