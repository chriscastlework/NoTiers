    public class QueryLogic : IViewListEvent<FieldTypesViewModel, FieldTypes>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<FieldType> repository, NgTable<FieldTypes> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<FieldTypesViewModel>();

            var query = FieldTypesMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   