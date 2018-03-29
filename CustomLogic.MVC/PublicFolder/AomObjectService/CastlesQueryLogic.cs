    public class QueryLogic : IViewListEvent<AomObjectViewModel, AomObject>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<AomObject> repository, NgTable<AomObject> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomObjectViewModel>();

            var query = AomObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   