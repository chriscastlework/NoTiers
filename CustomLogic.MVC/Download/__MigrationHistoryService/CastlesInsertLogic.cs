using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.MigrationHistoryService
{
    public class Save : IInsertEvent<MigrationHistoryViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(MigrationHistoryViewModel model, IUnitOfWork unitOfWork, Response<MigrationHistoryViewModel> result, ICoreUser user)
        {
          
            var newCustom = MigrationHistoryMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<MigrationHistory>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = MigrationHistoryMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(MigrationHistoryViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<MigrationHistory>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<MigrationHistory>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}