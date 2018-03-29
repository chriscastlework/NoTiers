    public class Delete : IDeleteEvent<RelationshipMetaViewModel>
    {
        public bool Run(RelationshipMetaViewModel model, IUnitOfWork unitOfWork, Response<RelationshipMetaViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<RelationshipMeta>().Find(model.Id);
            unitOfWork.With<RelationshipMeta>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
