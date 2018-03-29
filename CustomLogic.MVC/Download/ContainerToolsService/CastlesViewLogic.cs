using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerToolsService
{
    public class View : IViewEvent<ContainerToolsViewModel,ContainerTool >
    {
        public int CreatedId = 0;

        public Response<ContainerToolsViewModel> Run(ContainerToolsViewModel model,ref IQueryable<ContainerTool> repository, IUnitOfWork unitOfWork, Response<ContainerToolsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = ContainerToolsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing ContainerTools"); 
            }

            return result;
        }

  
    
    }
}