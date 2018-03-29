using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldObjectService
{
    public class View : IViewEvent<AomFieldObjectViewModel,AomFieldObject >
    {
        public int CreatedId = 0;

        public Response<AomFieldObjectViewModel> Run(AomFieldObjectViewModel model,ref IQueryable<AomFieldObject> repository, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomFieldObject"); 
            }

            return result;
        }

  
    
    }
}