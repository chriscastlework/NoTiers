    public class QueryLogic : IViewListEvent<RelationshipTypesViewModel, RelationshipTypes>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<RelationshipType> repository, NgTable<RelationshipTypes> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<RelationshipTypesViewModel>();

            var query = RelationshipTypesMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   