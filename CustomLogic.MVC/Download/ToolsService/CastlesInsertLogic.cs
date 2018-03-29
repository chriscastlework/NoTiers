using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.ToolsService
{
    public class Save : IInsertEvent<ToolsViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(ToolsViewModel model, IUnitOfWork unitOfWork, Response<ToolsViewModel> result, ICoreUser user)
        {
          
            var newCustom = ToolsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Tool>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = ToolsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(ToolsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Tool>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<Tool>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}