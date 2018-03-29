
    public class Save : IInsertEvent<AomMetaViewModel>
    {
        public int CreatedId = 0;

        public bool Run(AomMetaViewModel model, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result)
        {
          
            var newCustom = AomMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
            var newCustomResult = AomMetaMapper.MapDbModelToViewModel(newCustom);
            result.Data = newCustomResult;
            return true;
        }

        public bool Rollback(AomMetaViewModel model, IUnitOfWork unitOfWork)
        {
            var removeItem = unitOfWork.With<AomMeta>().FirstOrDefault(c=>c.Id == CreatedId);
            unitOfWork.With<AomMeta>().Remove(removeItem);
            unitOfWork.SaveChanges();
            return true;
        }
    }