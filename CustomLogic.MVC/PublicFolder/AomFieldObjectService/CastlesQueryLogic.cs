    public class QueryLogic : IViewListEvent<AomFieldObjectViewModel, AomFieldObject>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<AomFieldObject> repository, NgTable<AomFieldObject> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomFieldObjectViewModel>();

            var query = AomFieldObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   