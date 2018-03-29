using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
    public class Delete : IDeleteEvent<TasksViewModel,Task >
    {
  
        public bool Run(TasksViewModel model, ref IQueryable<Task> repository, IUnitOfWork unitOfWork, Response<TasksViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<Task>().Find(model.Id);
            unitOfWork.With<Task>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}
