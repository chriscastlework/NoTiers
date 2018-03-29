using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.FieldTypesService
{
    public class Save : IInsertEvent<FieldTypesViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(FieldTypesViewModel model, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result, ICoreUser user)
        {
          
            var newCustom = FieldTypesMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<FieldType>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(FieldTypesViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<FieldType>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<FieldType>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}