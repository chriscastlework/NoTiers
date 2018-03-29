    public class QueryLogic : IViewListEvent<RelationshipMetaViewModel, RelationshipMeta>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<RelationshipMeta> repository, NgTable<RelationshipMeta> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<RelationshipMetaViewModel>();

            var query = RelationshipMetaMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   