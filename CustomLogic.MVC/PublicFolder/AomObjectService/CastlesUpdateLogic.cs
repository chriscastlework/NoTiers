
 public class Update : IUpdateEvent<AomObjectViewModel>
    {
        public bool Run(AomObjectViewModel model, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result)
        {
            var dbModel = unitOfWork.With<AomObject>().Find(model.Id);
            var updatedDbModel = AomObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
