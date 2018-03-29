using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomMetaService
{
    public class View : IViewEvent<AomMetaViewModel,AomMeta >
    {
        public int CreatedId = 0;

        public Response<AomMetaViewModel> Run(AomMetaViewModel model,ref IQueryable<AomMeta> repository, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomMeta"); 
            }

            return result;
        }

  
    
    }
}