    public class Delete : IDeleteEvent<AomFieldMetaViewModel>
    {
        public bool Run(AomFieldMetaViewModel model, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomFieldMeta>().Find(model.Id);
            unitOfWork.With<AomFieldMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
