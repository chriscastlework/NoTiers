 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
 using System.Linq;
 using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
 public class Update : IUpdateEvent<TasksViewModel,Task>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(TasksViewModel model, ref IQueryable<Task> repository, IUnitOfWork unitOfWork, Response<TasksViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = TasksMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<Task>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = TasksMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
