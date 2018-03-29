
 public class Update : IUpdateEvent<AomFieldObjectViewModel>
    {
        public bool Run(AomFieldObjectViewModel model, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result)
        {
            var dbModel = unitOfWork.With<AomFieldObject>().Find(model.Id);
            var updatedDbModel = AomFieldObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomFieldObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
