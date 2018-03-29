    public class Delete : IDeleteEvent<RelationshipObjectViewModel>
    {
        public bool Run(RelationshipObjectViewModel model, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result)
        {
            // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<RelationshipObject>().Find(model.Id);
            unitOfWork.With<RelationshipObject>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
