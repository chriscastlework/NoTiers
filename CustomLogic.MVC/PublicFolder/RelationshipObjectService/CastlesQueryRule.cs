
    public class LimitRelationshipObjects : IViewListRule<RelationshipObjectViewModel, RelationshipObject>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<RelationshipObject> repository, NgTable<RelationshipObject> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

		 public bool Run(NgTableParams model, ref IQueryable<RelationshipObject> repository, NgTable<RelationshipObject> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
		 // limit by organisation owner etc... business rules 
         //   throw new NotImplementedException();
        }

    }

