    public class QueryLogic : IViewListEvent<AomFieldMetaViewModel, AomFieldMeta>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<AomFieldMeta> repository, NgTable<AomFieldMeta> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomFieldMetaViewModel>();

            var query = AomFieldMetaMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   