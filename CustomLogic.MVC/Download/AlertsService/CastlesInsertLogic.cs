using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.AlertsService
{
    public class Save : IInsertEvent<AlertsViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(AlertsViewModel model, IUnitOfWork unitOfWork, Response<AlertsViewModel> result, ICoreUser user)
        {
          
            var newCustom = AlertsMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Alert>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = AlertsMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AlertsViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Alert>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<Alert>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}