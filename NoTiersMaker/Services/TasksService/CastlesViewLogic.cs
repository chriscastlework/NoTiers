using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
    public class View : IViewEvent<TasksViewModel,Task >
    {
        public int CreatedId = 0;

        public Response<TasksViewModel> Run(TasksViewModel model,ref IQueryable<Task> repository, IUnitOfWork unitOfWork, Response<TasksViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = TasksMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Tasks"); 
            }

            return result;
        }

  
    
    }
}