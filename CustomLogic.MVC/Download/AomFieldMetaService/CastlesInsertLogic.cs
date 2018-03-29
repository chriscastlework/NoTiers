using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.AomFieldMetaService
{
    public class Save : IInsertEvent<AomFieldMetaViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(AomFieldMetaViewModel model, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result, ICoreUser user)
        {
          
            var newCustom = AomFieldMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomFieldMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomFieldMetaViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomFieldMeta>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomFieldMeta>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}