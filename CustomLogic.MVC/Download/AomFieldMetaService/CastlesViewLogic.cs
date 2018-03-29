using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldMetaService
{
    public class View : IViewEvent<AomFieldMetaViewModel,AomFieldMeta >
    {
        public int CreatedId = 0;

        public Response<AomFieldMetaViewModel> Run(AomFieldMetaViewModel model,ref IQueryable<AomFieldMeta> repository, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing AomFieldMeta"); 
            }

            return result;
        }

  
    
    }
}