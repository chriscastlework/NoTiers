using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.RelationshipObjectService
{
    public class Save : IInsertEvent<RelationshipObjectViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(RelationshipObjectViewModel model, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result, ICoreUser user)
        {
          
            var newCustom = RelationshipObjectMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<RelationshipObject>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(RelationshipObjectViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<RelationshipObject>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<RelationshipObject>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}