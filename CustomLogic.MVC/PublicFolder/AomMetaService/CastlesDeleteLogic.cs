    public class Delete : IDeleteEvent<AomMetaViewModel>
    {
        public bool Run(AomMetaViewModel model, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<AomMeta>().Find(model.Id);
            unitOfWork.With<AomMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
