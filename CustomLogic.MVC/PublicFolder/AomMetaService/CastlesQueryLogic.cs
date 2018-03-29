    public class QueryLogic : IViewListEvent<AomMetaViewModel, AomMeta>
    {
       

        public bool Run(NgTableParams model, ref IQueryable<AomMeta> repository, NgTable<AomMeta> result, ICoreUser user, IUnitOfWork db)
        {
            var ngTransformer = new QueryToNgTable<AomMetaViewModel>();

            var query = AomMetaMapper.MapDbModelQueryToViewModelQuery(repository);

            ngTransformer.ToNgTableDataSet(model, query, result);
            return true;
        }
    }
   