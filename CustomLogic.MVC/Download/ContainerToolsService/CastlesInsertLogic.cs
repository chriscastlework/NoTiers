using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.ContainerToolsService
{
    public class Save : IInsertEvent<ContainerToolsViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(ContainerToolsViewModel model, IUnitOfWork unitOfWork, Response<ContainerToolsViewModel> result, ICoreUser user)
        {
          
            var newCustom = ContainerToolsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<ContainerTool>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = ContainerToolsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(ContainerToolsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<ContainerTool>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<ContainerTool>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}