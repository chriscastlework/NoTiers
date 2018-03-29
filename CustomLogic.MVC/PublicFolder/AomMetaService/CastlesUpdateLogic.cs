
 public class Update : IUpdateEvent<AomMetaViewModel>
    {
        public bool Run(AomMetaViewModel model, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result)
        {
            var dbModel = unitOfWork.With<AomMeta>().Find(model.Id);
            var updatedDbModel = AomMetaMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomMeta>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
