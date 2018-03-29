    public class QueryLogic : IViewListEvent<RelationshipObjectViewModel, RelationshipObject>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<RelationshipObject> repository, NgTable<RelationshipObject> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<RelationshipObjectViewModel>();

            var query = RelationshipObjectMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   