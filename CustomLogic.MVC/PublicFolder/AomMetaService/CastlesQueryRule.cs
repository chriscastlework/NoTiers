
    public class LimitAomMetas : IViewListRule<AomMetaViewModel, AomMeta>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<AomMeta> repository, NgTable<AomMeta> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

		 public bool Run(NgTableParams model, ref IQueryable<AomMeta> repository, NgTable<AomMeta> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
		 // limit by organisation owner etc... business rules 
         //   throw new NotImplementedException();
        }

    }

