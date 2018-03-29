using System;
using System.Linq;
using CustomLogic;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;


namespace CustomLogic.Services.ContainersService
{
    public class Save : IInsertEvent<ContainersViewModel>
    {
        public Guid CreatedId; // Might be a composite key!

        public bool Run(ContainersViewModel model, IUnitOfWork unitOfWork, Response<ContainersViewModel> result, ICoreUser user)
        {
          
            var newCustom = ContainersMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<Container>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            model.Id = CreatedId; // Might be a composit key
            var newCustomResult = ContainersMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(ContainersViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<Container>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<Container>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }

        public int priority()
        {
            return 1;
        }
    }
}