using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.ContainerAlertsService
{
    public class Save : IInsertEvent<ContainerAlertsViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(ContainerAlertsViewModel model, IUnitOfWork unitOfWork, Response<ContainerAlertsViewModel> result, ICoreUser user)
        {
          
            var newCustom = ContainerAlertsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<ContainerAlert>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = ContainerAlertsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(ContainerAlertsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<ContainerAlert>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<ContainerAlert>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}