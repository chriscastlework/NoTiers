
    public class Save : IInsertEvent<AomObjectViewModel>
    {
        public int CreatedId = 0;

        public bool Run(AomObjectViewModel model, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result)
        {
          
            var newCustom = AomObjectMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomObject>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = AomObjectMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomObjectViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomObject>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomObject>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }