
    public class Save : IInsertEvent<AomFieldMetaViewModel>
    {
        public int CreatedId = 0;

        public bool Run(AomFieldMetaViewModel model, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result)
        {
          
            var newCustom = AomFieldMetaMapper.MapInsertModelToDbModel(model);
            unitOfWork.With<AomFieldMeta>().Add(newCustom);
            unitOfWork.SaveChanges();
            CreatedId = newCustom.Id;
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
    }