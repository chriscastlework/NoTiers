using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
    public class View : IViewEvent<RelationshipObjectViewModel,RelationshipObject >
    {
        public int CreatedId = 0;

        public Response<RelationshipObjectViewModel> Run(RelationshipObjectViewModel model,ref IQueryable<RelationshipObject> repository, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing RelationshipObject"); 
            }

            return result;
        }

  
    
    }
}