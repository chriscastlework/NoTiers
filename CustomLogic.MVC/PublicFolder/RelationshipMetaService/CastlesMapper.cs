 public static class RelationshipMetaMapper
    {


        public static RelationshipMeta MapInsertModelToDbModel(RelationshipMetaViewModel model, RelationshipMeta newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new RelationshipMeta();
            }

newDomainModel.ID = model.ID;
newDomainModel.PkAOMMetaID = model.PkAOMMetaID;
newDomainModel.FkAOMMetaID = model.FkAOMMetaID;
newDomainModel.FkAOMFieldMetaID = model.FkAOMFieldMetaID;
newDomainModel.RelationshipTypeID = model.RelationshipTypeID;

            return newDomainModel;
        }



        public static RelationshipMetaViewModel MapDbModelToViewModel(RelationshipMeta dbModel)
        {
            var viewModel = new  RelationshipMetaViewModel();
viewModel.ID = dbModel.ID;
viewModel.PkAOMMetaID = dbModel.PkAOMMetaID;
viewModel.FkAOMMetaID = dbModel.FkAOMMetaID;
viewModel.FkAOMFieldMetaID = dbModel.FkAOMFieldMetaID;
viewModel.RelationshipTypeID = dbModel.RelationshipTypeID;
            return viewModel;
        }

        public static IQueryable<RelationshipMetaViewModel> MapDbModelQueryToViewModelQuery(IQueryable<RelationshipMeta> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new RelationshipMetaViewModel()
                                             {
                                                 ID = c.ID,
PkAOMMetaID = c.PkAOMMetaID,
FkAOMMetaID = c.FkAOMMetaID,
FkAOMFieldMetaID = c.FkAOMFieldMetaID,
RelationshipTypeID = c.RelationshipTypeID,
                                             });
        }




}

