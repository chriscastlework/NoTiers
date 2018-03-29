using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
    public class Save : IInsertEvent<TasksViewModel>
    {
        public int CreatedId = 0; // Might be a composite key!

        public bool Run(TasksViewModel model, IUnitOfWork unitOfWork, Response<TasksViewModel> result, ICoreUser user)
        {
          
            var newCustom = TasksMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Task>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = TasksMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(TasksViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Task>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<Task>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}