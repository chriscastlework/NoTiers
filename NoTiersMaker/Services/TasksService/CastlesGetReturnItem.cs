using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
    public class ReturnResultEvent : IUpdateEvent<TasksViewModel, Task>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(TasksViewModel model, ref IQueryable< Task> repository, IUnitOfWork unitOfWork, Response<TasksViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< Task>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = TasksMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
