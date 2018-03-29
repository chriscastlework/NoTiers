
 public class Update : IUpdateEvent<AomFieldMetaViewModel>
    {
        public bool Run(AomFieldMetaViewModel model, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result)
        {
            var dbModel = unitOfWork.With<AomFieldMeta>().Find(model.Id);
            var updatedDbModel = AomFieldMetaMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomFieldMeta>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
