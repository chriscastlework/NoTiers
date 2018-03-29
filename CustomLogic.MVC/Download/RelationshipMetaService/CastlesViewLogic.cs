using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
    public class View : IViewEvent<RelationshipMetaViewModel,RelationshipMeta >
    {
        public int CreatedId = 0;

        public Response<RelationshipMetaViewModel> Run(RelationshipMetaViewModel model,ref IQueryable<RelationshipMeta> repository, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = RelationshipMetaMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing RelationshipMeta"); 
            }

            return result;
        }

  
    
    }
}