using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ToolsService
{
    public class View : IViewEvent<ToolsViewModel,Tool >
    {
        public int CreatedId = 0;

        public Response<ToolsViewModel> Run(ToolsViewModel model,ref IQueryable<Tool> repository, IUnitOfWork unitOfWork, Response<ToolsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = ToolsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Tools"); 
            }

            return result;
        }

  
    
    }
}